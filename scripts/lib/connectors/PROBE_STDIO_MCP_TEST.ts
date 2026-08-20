import assert from "node:assert/strict"
import test from "node:test"
import { probeStdioMcp } from "./probeStdioMcp"

void test("the stdio probe requires both initialize and tools/list responses", async () => {
  const server = [
    'const rl = require("node:readline").createInterface({ input: process.stdin })',
    'rl.on("line", (line) => {',
    "  const request = JSON.parse(line)",
    '  const result = request.method === "initialize" ? { protocolVersion: "2025-06-18" } : { tools: [] }',
    '  process.stdout.write(JSON.stringify({ jsonrpc: "2.0", id: request.id, result }) + "\\n")',
    "})",
  ].join("\n")

  const result = await probeStdioMcp(process.execPath, ["-e", server])
  assert.equal(result.status, "healthy")
  assert.equal(result.summary, "MCP initialize and tools/list succeeded")
})
