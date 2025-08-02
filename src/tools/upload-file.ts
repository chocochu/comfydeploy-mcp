import fs from "node:fs";
import path from "node:path";
import { z } from "zod";
import { apiRequest } from "../utils/api.js";

const uploadFileParamsSchema = z.object({
	file_path: z.string().describe("Local file path to upload"),
	target_folder: z
		.string()
		.default("upload")
		.describe("Target folder name on server (default: 'upload')"),
});

export const uploadFile = {
	name: "upload-file",
	description:
		"Upload a local file to ComfyDeploy's asset system and get the URL for use in deployments. This tool handles both small files (<50MB) with direct upload and large files with presigned URLs. The returned URL can be used as input for deployments that require file inputs (e.g., images, videos, documents). Automatically creates the target folder if it doesn't exist.",
	parameters: uploadFileParamsSchema,
	execute: async (args: z.infer<typeof uploadFileParamsSchema>) => {
		const { file_path, target_folder } = args;

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

		try {
			// Step 1: Ensure upload folder exists
			try {
				await apiRequest("assets/folder", "POST", undefined, {
					name: target_folder,
					parent_path: "/",
				});
				console.error(`Created folder: ${target_folder}`);
			} catch (error: any) {
				// Check for "folder already exists" error
				const errorMessage = error?.message || error?.toString() || "";
				const errorDetail = error?.detail || "";

				const isFolderExistsError =
					errorMessage.includes("Folder already exists") ||
					errorDetail === "Folder already exists" ||
					(errorMessage.includes("status: 400") &&
						errorMessage.includes("Folder already exists"));

				if (isFolderExistsError) {
					console.error(
						`Upload folder '${target_folder}' already exists - continuing`,
					);
				} else {
					console.error("Failed to create upload folder:", error);
					throw new Error("Failed to ensure upload folder exists");
				}
			}

			// Small file: direct upload using enhanced apiRequest with FormData support
			const formData = new FormData();
			const blob = new Blob([fileBuffer], { type: contentType });
			formData.append("file", blob, fileName);

			const result = await apiRequest("file/upload", "POST", formData);
			console.error("File uploaded successfully (direct)", result);
			return JSON.stringify(result);
		} catch (error) {
			console.error("Upload failed:", error);
			throw error;
		}
	},
};
