import { MCPError } from "../types";
import "@dotenvx/dotenvx/config";

let currentApiKey: string | null = null;

/**
 * Gets the current API key
 * @returns The API key or null if not set
 * @throws {MCPError} If no API key is configured
 */

export function authenticate(): void {
	if (!getCurrentApiKey()) {
		throw new MCPError("INVALID_API_KEY", "Invalid API key");
	}
}

/**
 * Sets the API key
 * @param apiKey - The API key to use
 */
export function setApiKey(apiKey: string): void {
	currentApiKey = apiKey;
}

/**
 * Gets the current API key
 * @returns The current API key or null if not set
 */
export function getCurrentApiKey(): string | null {
	return currentApiKey ?? process.env.API_KEY ?? null;
}

/**
 * Checks if the client is configured
 * @returns True if the client is configured, false otherwise
 */
export function isClientConfigured(): boolean {
	return getCurrentApiKey() !== null;
}
