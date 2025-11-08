#!/bin/bash

# Homebox MCP Server Update Script
# This script updates the homebox-mcp-server package from the npm registry

set -e

echo "🔄 Updating Homebox MCP Server..."
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ Error: npm is not installed"
    echo "Please install Node.js and npm first"
    exit 1
fi

# Update the package globally
echo "📦 Updating homebox-mcp-server from npm registry..."
npm update -g homebox-mcp-server

echo ""
echo "✅ Update complete!"
echo ""
echo "ℹ️  To verify the installation, run:"
echo "   npm list -g homebox-mcp-server"
echo ""
echo "ℹ️  To check the version, run:"
echo "   homebox-mcp-server --version"
