import { createHash } from "node:crypto"

/**
 * Compute SHA-256 hex digest of a buffer or string.
 *
 * @param {Buffer | string} buffer - Input data
 * @returns {string} - Hex-encoded digest
 */
export const sha256 = (buffer) => createHash("sha256").update(buffer).digest("hex")
