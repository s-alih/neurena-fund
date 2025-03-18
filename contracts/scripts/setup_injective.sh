#!/bin/bash

# Exit on error
set -e

# Create Injective directory
mkdir -p ~/.injective

# Pull the latest Injective Core Docker image
docker pull --platform linux/amd64 injectivelabs/injective-core:v1.14.1

# Create an alias function for injectived
echo '
# Injective CLI alias
function injectived() {
    docker run -it --rm \
        --platform linux/amd64 \
        -v ~/.injective:/root/.injective \
        injectivelabs/injective-core:v1.14.1 \
        injectived "$@"
}
' >> ~/.zshrc

# Source the updated profile
source ~/.zshrc

# Initialize the config directory with a moniker
docker run -it --rm \
    --platform linux/amd64 \
    -v ~/.injective:/root/.injective \
    injectivelabs/injective-core:v1.14.1 \
    injectived init "my-node" --chain-id injective-888

# Configure the client for testnet
docker run -it --rm \
    --platform linux/amd64 \
    -v ~/.injective:/root/.injective \
    injectivelabs/injective-core:v1.14.1 \
    injectived config chain-id injective-888

docker run -it --rm \
    --platform linux/amd64 \
    -v ~/.injective:/root/.injective \
    injectivelabs/injective-core:v1.14.1 \
    injectived config node "https://k8s.testnet.tm.injective.network:443"

echo "Injective CLI setup complete!"
echo "Please run 'source ~/.zshrc' to load the new configuration"
echo "You can now use 'injectived' command through Docker" 