#!/bin/bash

# Exit on error
set -e

# Create artifacts directory
mkdir -p artifacts

# Function to build and optimize contract
build_contract() {
    CONTRACT_NAME=$1
    echo "Building and optimizing $CONTRACT_NAME contract..."
    
    # Navigate to contract directory
    cd $CONTRACT_NAME
    
    # Build the contract
    echo "Building WASM..."
    RUSTFLAGS='-C link-arg=-s' cargo build --release --target wasm32-unknown-unknown --lib
    
    # Generate schema (using default target)
    echo "Generating schema..."
    cargo run --bin schema
    
    # Create schema directory if it doesn't exist
    mkdir -p schema
    
    # Copy the wasm file to artifacts
    echo "Copying artifacts..."
    cp target/wasm32-unknown-unknown/release/*.wasm "../artifacts/$CONTRACT_NAME.wasm"
    
    # Copy schema to artifacts
    mkdir -p "../artifacts/$CONTRACT_NAME"
    cp -r schema/* "../artifacts/$CONTRACT_NAME/" 2>/dev/null || true
    
    # Go back to contracts directory
    cd ..
    
    echo "Contract $CONTRACT_NAME built and optimized"
}

# Build each contract
build_contract "tournament"
build_contract "vault"

echo "All contracts built and optimized" 