import { expect, test } from "bun:test";
import { FastMCP } from "fastmcp";

test("test", () => {
	const server = new FastMCP({
		name: "test",
		version: "1.0.0",
	});
});
