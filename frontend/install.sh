
#!/bin/bash

# Install dependencies using the available yarn version
# This bypasses the need for corepack enable
echo "Installing dependencies with available Yarn version..."
yarn install

# Set up VS Code SDKs for Yarn
echo "Setting up VS Code SDKs..."
yarn dlx @yarnpkg/sdks vscode
