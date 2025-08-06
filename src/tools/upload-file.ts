import fs from "node:fs";
import path from "node:path";
import { z } from "zod";
import { apiRequest } from "../utils/api.js";

const uploadFileParamsSchema = z.object({
	file_path: z.string().describe("Local file path to upload"),
});

export const uploadFile = {
	name: "upload-file",
	description:
		"Upload a local file to ComfyDeploy and get the URL for use in running deployments. The returned URL can be used as input for deployments that require file inputs (e.g., images, videos, documents).",
	parameters: uploadFileParamsSchema,
	execute: async (args: z.infer<typeof uploadFileParamsSchema>) => {
		const { file_path } = args;

		// Check if file exists
		if (!fs.existsSync(file_path)) {
			throw new Error(`File not found: ${file_path}`);
		}

		const fileName = path.basename(file_path);
		const fileBuffer = fs.readFileSync(file_path);

		// Try to determine MIME type based on file extension
		const getContentType = (filePath: string): string => {
			const ext = path.extname(filePath).toLowerCase();
			const mimeTypes: Record<string, string> = {
				".jpg": "image/jpeg",
				".jpeg": "image/jpeg",
				".png": "image/png",
				".gif": "image/gif",
				".webp": "image/webp",
				".mp4": "video/mp4",
				".mov": "video/quicktime",
				".avi": "video/x-msvideo",
				".mkv": "video/x-matroska",
				".pdf": "application/pdf",
				".txt": "text/plain",
				".json": "application/json",
			};
			return mimeTypes[ext] || "application/octet-stream";
		};

		const contentType = getContentType(file_path);

		const formData = new FormData();
		const blob = new Blob([fileBuffer], { type: contentType });
		formData.append("file", blob, fileName);

		const result = await apiRequest(
			"/file/upload",
			"POST",
			undefined,
			formData,
		);
		return JSON.stringify(result);
	},
};
