import { getCurrentApiKey } from "./auth.js";

export async function apiRequest(
	endpoint: string,
	method: "GET" | "POST" | "PUT" | "DELETE",
	params?: Record<string, any> | string,
	body?: any,
	options?: {
		skipJsonStringify?: boolean;
		customHeaders?: Record<string, string>;
	},
) {
	const baseUrl = "https://api.comfydeploy.com/api";
	const apiKey = getCurrentApiKey();

	// Base headers
	const headers: Record<string, string> = {
		Authorization: `Bearer ${apiKey}`,
	};

	// Add Content-Type for JSON unless it's FormData or explicitly skipped
	const isFormData = body instanceof FormData;
	if (!isFormData && !options?.skipJsonStringify) {
		headers["Content-Type"] = "application/json";
	}

	// Add custom headers if provided
	if (options?.customHeaders) {
		Object.assign(headers, options.customHeaders);
	}

	let queryString: string = "";
	if (params) {
		if (typeof params === "string") {
			queryString = params;
		} else {
			const queryParams = new URLSearchParams();
			Object.entries(params).forEach(([key, value]) => {
				if (value !== undefined) {
					queryParams.set(key, value.toString());
				}
			});
			queryString = queryParams.toString();
		}
	}

	const url = `${baseUrl}${endpoint}?${queryString}`;

	// Prepare request body
	let requestBody: any;
	if (body) {
		if (isFormData || options?.skipJsonStringify) {
			requestBody = body; // Pass FormData or raw body directly
		} else {
			requestBody = JSON.stringify(body); // JSON stringify for regular objects
		}
	}

	const response = await fetch(url, {
		method,
		headers,
		...(requestBody && { body: requestBody }),
	});
	return response.json();
}
