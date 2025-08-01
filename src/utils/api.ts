import { getCurrentApiKey } from "./auth";

export async function apiRequest(
	endpoint: string,
	method: "GET" | "POST" | "PUT" | "DELETE",
	params?: Record<string, any> | string,
	body?: any,
) {
	const baseUrl = "https://api.comfydeploy.com/api";
	const apiKey = getCurrentApiKey();
	const headers = {
		"Content-Type": "application/json",
		Authorization: `Bearer ${apiKey}`,
	};
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
	const response = await fetch(url, {
		method,
		headers,
		...(body && { body: JSON.stringify(body) }),
	});
	return response.json();
}
