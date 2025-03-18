#!/bin/bash

# Exit on error
set -e

# Enable debug output
set -x

# Check if network argument is provided
if [ -z "$1" ]; then
    echo "Please specify network (testnet or mainnet)"
    exit 1
fi

NETWORK=$1

# Define the injectived command using the persistent container
INJECTIVED="docker exec injective-wallet injectived"

# Load configuration
echo "Loading configuration for $NETWORK..."
CONFIG=$(cat scripts/config.json | jq -r ".$NETWORK")
echo "Config loaded: $CONFIG"
RPC=$(echo $CONFIG | jq -r '.rpc')
echo "RPC: $RPC"
CHAIN_ID=$(echo $CONFIG | jq -r '.chain_id')
echo "Chain ID: $CHAIN_ID"
GAS_PRICE=$(echo $CONFIG | jq -r '.gas_price')
echo "Gas Price: $GAS_PRICE"
GAS_ADJUSTMENT=$(echo $CONFIG | jq -r '.gas_adjustment')
echo "Gas Adjustment: $GAS_ADJUSTMENT"

# Function to deploy contract
deploy_contract() {
    CONTRACT_NAME=$1
    echo "Deploying $CONTRACT_NAME contract to $NETWORK..."
    
    # Check if WASM file exists
    if [ ! -f "artifacts/$CONTRACT_NAME.wasm" ]; then
        echo "Error: WASM file not found at artifacts/$CONTRACT_NAME.wasm"
        exit 1
    fi
    
    # Store contract
    echo "Running store command..."
    STORE_OUTPUT=$($INJECTIVED tx wasm store "/workspace/artifacts/$CONTRACT_NAME.wasm" \
        --from=$WALLET_NAME \
        --chain-id=$CHAIN_ID \
        --node=$RPC \
        --gas-prices=${GAS_PRICE}inj \
        --gas-adjustment=$GAS_ADJUSTMENT \
        --gas=2000000 \
        --broadcast-mode=sync \
        --keyring-backend=test \
        -y -o json)
    
    echo "Store command output: $STORE_OUTPUT"
    
    # Extract txhash
    TX_HASH=$(echo "$STORE_OUTPUT" | jq -r '.txhash')
    if [ -z "$TX_HASH" ] || [ "$TX_HASH" = "null" ]; then
        echo "Error: Failed to get transaction hash"
        echo "Full output: $STORE_OUTPUT"
        exit 1
    fi
    
    echo "Contract stored with tx hash: $TX_HASH"
    
    # Wait for transaction to be included in a block
    echo "Waiting for transaction to be included in a block..."
    sleep 5
    
    # Get code ID
    echo "Getting code ID..."
    TX_RESULT=$($INJECTIVED query tx $TX_HASH --node=$RPC --chain-id=$CHAIN_ID -o json)
    echo "Transaction result: $TX_RESULT"
    
    CODE_ID=$(echo "$TX_RESULT" | jq -r '.logs[0].events[] | select(.type=="store_code").attributes[] | select(.key=="code_id").value')
    if [ -z "$CODE_ID" ] || [ "$CODE_ID" = "null" ]; then
        echo "Error: Failed to get code ID"
        echo "Full transaction result: $TX_RESULT"
        exit 1
    fi
    
    echo "$CONTRACT_NAME contract deployed with code ID: $CODE_ID"
    
    # Save code ID to deployment log
    echo "Saving deployment info..."
    echo "{\"$CONTRACT_NAME\": {\"code_id\": $CODE_ID, \"network\": \"$NETWORK\", \"tx_hash\": \"$TX_HASH\"}}" > "artifacts/$CONTRACT_NAME-deployment.json"
}

# Check if wallet name is set
if [ -z "$WALLET_NAME" ]; then
    echo "Please set WALLET_NAME environment variable"
    exit 1
fi

# Deploy contracts
deploy_contract "tournament"
deploy_contract "vault"

echo "Deployment completed successfully!" 