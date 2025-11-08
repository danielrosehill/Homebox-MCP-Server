# Local AI Stack Example: LM Studio + Qwen 3 8B

This example demonstrates how to use the Homebox MCP Server with a local AI stack using LM Studio and Qwen 3 8B (or any other local LLM that supports tool calling/function calling).

## Prerequisites

1. **LM Studio** installed and running
2. **A local LLM with function calling support** (e.g., Qwen 3 8B, Llama 3.1 8B, Mistral, etc.)
3. **Homebox MCP Server** set up and configured

## Why Local AI?

Running AI models locally offers several advantages:
- **Privacy**: Your data never leaves your machine
- **Cost**: No API usage fees
- **Availability**: Works offline
- **Control**: Full control over model selection and parameters

## Supported Models

Any local LLM that supports function calling/tool use will work. Popular choices include:

- **Qwen 3 8B** (recommended) - Excellent function calling, efficient
- **Llama 3.1 8B** - Strong performance, good tool use
- **Llama 3.3 70B** - More powerful but requires more resources
- **Mistral 7B** - Fast and efficient
- **DeepSeek Coder** - Great for coding tasks

## Setup Steps

### 1. Install LM Studio

Download and install LM Studio from [lmstudio.ai](https://lmstudio.ai)

### 2. Download a Model

In LM Studio:
1. Go to the "Discover" tab
2. Search for "Qwen 3 8B" (or your preferred model)
3. Download the model (recommended: Q4_K_M quantization for balance of speed/quality)

### 3. Start Local Server

In LM Studio:
1. Go to the "Local Server" tab
2. Load your chosen model
3. Click "Start Server"
4. Note the server URL (typically `http://localhost:1234/v1`)

### 4. Configure MCP Server

Create or update your MCP configuration file. See `mcp-config-example.json` in this directory for a complete example.

Key configuration:
```json
{
  "mcpServers": {
    "homebox": {
      "command": "node",
      "args": ["/path/to/homebox-mcp-server/build/index.js"],
      "env": {
        "HOMEBOX_BASE_URL": "http://your-homebox-instance:7745",
        "HOMEBOX_TOKEN": "your-token-here"
      }
    }
  }
}
```

### 5. Connect Your AI Client

Configure your AI client (Claude Desktop, Continue, etc.) to use:
- **Model**: Select your loaded model
- **API Base URL**: `http://localhost:1234/v1`
- **API Key**: Not required for LM Studio (can use any value)

## Example Usage

Once configured, you can use natural language to interact with your Homebox instance:

```
User: What items do I have in my garage?
AI: [Uses list_items tool with location filter]

User: Add a new screwdriver to my toolbox
AI: [Uses create_item tool]

User: Show me all items worth more than $100
AI: [Uses list_items tool and filters results]
```

## Performance Considerations

### Hardware Recommendations

- **Minimum**: 16GB RAM, modern CPU
- **Recommended**: 32GB RAM, GPU with 8GB+ VRAM
- **Optimal**: 64GB RAM, GPU with 24GB+ VRAM (for larger models)

### Model Selection Guide

| Model | RAM | VRAM | Speed | Quality | Best For |
|-------|-----|------|-------|---------|----------|
| Qwen 3 8B (Q4) | 8GB | 6GB | Fast | Good | General use |
| Llama 3.1 8B | 8GB | 6GB | Fast | Good | General use |
| Qwen 3 14B | 16GB | 10GB | Medium | Better | Complex tasks |
| Llama 3.3 70B | 48GB | 40GB | Slow | Best | High accuracy |

### Optimization Tips

1. **Use quantized models**: Q4_K_M or Q5_K_M for best speed/quality balance
2. **GPU acceleration**: Enable GPU in LM Studio settings if available
3. **Adjust context length**: Reduce if experiencing slowness
4. **Batch processing**: Process multiple requests together when possible

## Troubleshooting

### Model not responding to tool calls

- Ensure your model supports function calling
- Try a different model known for good tool use (Qwen 3, Llama 3.1)
- Check LM Studio console for errors

### Connection errors

- Verify LM Studio server is running
- Check the API base URL matches your LM Studio configuration
- Ensure no firewall is blocking localhost connections

### Slow responses

- Use a smaller/more quantized model
- Enable GPU acceleration
- Reduce context window size
- Close other resource-intensive applications

## Alternative Local AI Solutions

While this example uses LM Studio, the Homebox MCP Server works with any MCP-compatible client using local models:

- **Ollama** - CLI-focused, great for automation
- **LocalAI** - OpenAI-compatible API
- **GPT4All** - User-friendly desktop app
- **Text Generation WebUI** - Advanced features and customization

## Resources

- [LM Studio Documentation](https://lmstudio.ai/docs)
- [MCP Specification](https://spec.modelcontextprotocol.io/)
- [Homebox MCP Server GitHub](https://github.com/yourusername/homebox-mcp-server)
- [Local LLM Leaderboard](https://huggingface.co/spaces/lmsys/chatbot-arena-leaderboard)

## Contributing

Have improvements or additional local AI configurations? PRs welcome!
