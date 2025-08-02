# ComfyDeploy MCP Server

ComfyDeploy MCP Server enables AI generation deployments via the Model Context Protocol.

## Requirements

- **Node.js v20.0.0 or higher** (required for File API support)
- Bun (for development)

## Installation

### Global Installation

```bash
bunx comfydeploy-mcp
```

### Development Setup

```bash
bun install
```

## Usage

### Development Mode

```bash
bun run dev
```

### Production Build

```bash
bun run build
bun run start
```

### MCP Integration

Use with MCP clients like Claude Desktop by adding to your configuration:

```json
{
  "mcpServers": {
    "comfydeploy": {
      "command": "bunx",
      "args": ["comfydeploy-mcp"]
    }
  }
}
```

This project was created using `bun init` in bun v1.2.19. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.
