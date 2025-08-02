import { config } from "@dotenvx/dotenvx";

config({ path: [".env.missing", ".env"], ignore: ["MISSING_ENV_FILE"] });

const currentApiKey: string | null = null;
/**
 * Gets the current API key
 * @returns The current API key or null if not set
 */
export function getCurrentApiKey(): string | null {
	return currentApiKey ?? process.env.API_KEY ?? null;
}
