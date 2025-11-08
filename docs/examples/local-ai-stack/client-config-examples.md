# Client Configuration Examples

This document provides configuration examples for various MCP-compatible clients using local AI models.

## Claude Desktop with Local AI

While Claude Desktop typically uses Anthropic's API, you can configure it to work with MCP servers while using other AI interfaces for the actual LLM interaction.

**MCP Configuration** (`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS or `%APPDATA%\Claude\claude_desktop_config.json` on Windows):

```json
{
  "mcpServers": {
    "homebox": {
      "command": "node",
      "args": [
        "/absolute/path/to/homebox-mcp-server/build/index.js"
      ],
      "env": {
        "HOMEBOX_BASE_URL": "http://192.168.1.100:7745",
        "HOMEBOX_TOKEN": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
      }
    }
  }
}
```

## Continue.dev with LM Studio

Continue.dev is excellent for local AI + MCP integration.

**Continue Configuration** (`~/.continue/config.json`):

```json
{
  "models": [
    {
      "title": "Qwen 3 8B Local",
      "provider": "lmstudio",
      "model": "qwen3-8b",
      "apiBase": "http://localhost:1234/v1"
    }
  ],
  "mcpServers": [
    {
      "name": "homebox",
      "command": "node",
      "args": [
        "/absolute/path/to/homebox-mcp-server/build/index.js"
      ],
      "env": {
        "HOMEBOX_BASE_URL": "http://192.168.1.100:7745",
        "HOMEBOX_TOKEN": "your-token-here"
      }
    }
  ]
}
```

## Cline (formerly Claude Dev) with Local AI

Cline supports local models via LM Studio, Ollama, or other OpenAI-compatible APIs.

**Cline Settings** (VS Code settings.json):

```json
{
  "cline.mcpServers": {
    "homebox": {
      "command": "node",
      "args": [
        "/absolute/path/to/homebox-mcp-server/build/index.js"
      ],
      "env": {
        "HOMEBOX_BASE_URL": "http://192.168.1.100:7745",
        "HOMEBOX_TOKEN": "your-token-here"
      }
    }
  },
  "cline.apiProvider": "lmstudio",
  "cline.lmStudioBaseUrl": "http://localhost:1234/v1",
  "cline.lmStudioModelId": "qwen3-8b-instruct"
}
```

## Ollama Integration

If using Ollama instead of LM Studio:

### 1. Start Ollama

```bash
# Pull a model with good function calling support
ollama pull qwen2.5:14b-instruct-q5_K_M

# Or Llama 3.1
ollama pull llama3.1:8b-instruct

# Start Ollama server (usually runs automatically)
ollama serve
```

### 2. Configure Your Client

**Continue.dev with Ollama**:

```json
{
  "models": [
    {
      "title": "Qwen 2.5 14B",
      "provider": "ollama",
      "model": "qwen2.5:14b-instruct-q5_K_M"
    }
  ],
  "mcpServers": [
    {
      "name": "homebox",
      "command": "node",
      "args": ["/absolute/path/to/homebox-mcp-server/build/index.js"],
      "env": {
        "HOMEBOX_BASE_URL": "http://192.168.1.100:7745",
        "HOMEBOX_TOKEN": "your-token-here"
      }
    }
  ]
}
```

## Open WebUI with MCP

Open WebUI supports both local models and MCP servers.

**MCP Configuration** (Open WebUI settings):

```json
{
  "mcp": {
    "servers": {
      "homebox": {
        "command": "node",
        "args": [
          "/absolute/path/to/homebox-mcp-server/build/index.js"
        ],
        "env": {
          "HOMEBOX_BASE_URL": "http://192.168.1.100:7745",
          "HOMEBOX_TOKEN": "your-token-here"
        }
      }
    }
  }
}
```

## Environment Variables Best Practices

### Option 1: Direct in Config (Simple)

```json
{
  "env": {
    "HOMEBOX_BASE_URL": "http://192.168.1.100:7745",
    "HOMEBOX_TOKEN": "your-token-here"
  }
}
```

### Option 2: Reference System Variables (More Secure)

```json
{
  "env": {
    "HOMEBOX_BASE_URL": "${HOMEBOX_BASE_URL}",
    "HOMEBOX_TOKEN": "${HOMEBOX_TOKEN}"
  }
}
```

Then set in your shell:

```bash
# Add to ~/.bashrc or ~/.zshrc
export HOMEBOX_BASE_URL="http://192.168.1.100:7745"
export HOMEBOX_TOKEN="your-token-here"
```

### Option 3: .env File (Recommended)

Create `.env` file in your project:

```env
HOMEBOX_BASE_URL=http://192.168.1.100:7745
HOMEBOX_TOKEN=your-long-token-here
```

Then reference in MCP config and load via your environment manager.

## Testing Your Configuration

### 1. Verify MCP Server

```bash
# Test the server directly
node /path/to/homebox-mcp-server/build/index.js
```

### 2. Check Network Connectivity

```bash
# Verify Homebox is accessible
curl http://192.168.1.100:7745/api/v1/status \
  -H "Authorization: Bearer your-token-here"
```

### 3. Test Local LLM

**LM Studio**:
```bash
curl http://localhost:1234/v1/models
```

**Ollama**:
```bash
curl http://localhost:11434/api/tags
```

### 4. Try a Simple Query

Once configured, test with a simple request:

```
User: List my Homebox locations
```

The AI should use the `list_locations` tool to fetch your locations.

## Troubleshooting

### MCP Server Not Found

- Verify the absolute path to `index.js`
- Check Node.js is installed: `node --version`
- Ensure the build directory exists

### Authentication Errors

- Verify `HOMEBOX_TOKEN` is correct
- Check token hasn't expired
- Ensure `HOMEBOX_BASE_URL` is accessible

### Model Not Responding to Tools

- Use a model known for good function calling (Qwen 3, Llama 3.1)
- Check model is properly loaded in LM Studio/Ollama
- Verify the model supports function calling

### Connection Refused

- Check Homebox is running: `curl http://your-homebox:7745`
- Verify firewall rules allow connections
- Try localhost URL if on same machine: `http://localhost:7745`

## Recommended Combinations

### Best Overall (Balanced)
- **LLM**: Qwen 3 8B (Q5_K_M)
- **Client**: Continue.dev
- **Server**: LM Studio
- **Why**: Great function calling, user-friendly, good performance

### Best Privacy (Fully Local)
- **LLM**: Llama 3.1 8B
- **Client**: Cline in VS Code
- **Server**: Ollama
- **Why**: Everything local, no cloud dependencies

### Best Performance (If you have the hardware)
- **LLM**: Qwen 3 14B or Llama 3.3 70B
- **Client**: Continue.dev or Open WebUI
- **Server**: LM Studio with GPU
- **Why**: Superior reasoning and tool use

### Most Lightweight
- **LLM**: Mistral 7B (Q4_K_M)
- **Client**: Continue.dev
- **Server**: Ollama
- **Why**: Minimal resource usage, still capable

## Additional Resources

- [MCP Clients List](https://github.com/modelcontextprotocol/servers)
- [Continue.dev Documentation](https://continue.dev/docs)
- [LM Studio Guides](https://lmstudio.ai/docs)
- [Ollama Model Library](https://ollama.ai/library)
