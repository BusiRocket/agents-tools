import assert from "node:assert/strict"
import test from "node:test"
import { looksLikeListingArtifact } from "./looksLikeListingArtifact"

void test("many skills sharing one count is a catalogue listing, not usage", () => {
  const counts: Record<string, number> = {}
  for (let index = 0; index < 20; index++) {
    counts[`skill-${String(index)}`] = 912
  }
  assert.equal(looksLikeListingArtifact(counts), true)
})

void test("a spread of distinct counts reads as real usage", () => {
  const counts: Record<string, number> = {}
  for (let index = 0; index < 20; index++) {
    counts[`skill-${String(index)}`] = index + 2
  }
  assert.equal(looksLikeListingArtifact(counts), false)
})

void test("too few skills to judge is not called an artifact", () => {
  assert.equal(looksLikeListingArtifact({ a: 5, b: 5 }), false)
})

void test("counts of one are ignored, since a single read proves nothing either way", () => {
  const counts: Record<string, number> = {}
  for (let index = 0; index < 30; index++) {
    counts[`skill-${String(index)}`] = 1
  }
  assert.equal(looksLikeListingArtifact(counts), false)
})
