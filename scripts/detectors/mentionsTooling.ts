export const mentionsTooling = (content: string) =>
  /\bMCP\b|codex mcp|tool call|tool calls|remote MCP|OAuth/i.test(content)
