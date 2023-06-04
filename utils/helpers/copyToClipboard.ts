import { toast } from "react-toastify";

export async function copyToClipboard(text: string): Promise<void> {
	// Check if Clipboard API is supported
	if (navigator.clipboard && window.isSecureContext) {
		// Use the Clipboard API
		return navigator.clipboard
			.writeText(text)
			.then(() => {
				console.log("Text copied to clipboard");
				toast.info("Copied To clipboard", {
					position: "top-left",
					autoClose: 500,
				});
			})
			.catch((error) => {
				console.error("Failed to copy text to clipboard:", error);
			});
	}

	const textArea = document.createElement("textarea");
	textArea.value = text;
	textArea.style.position = "fixed";
	document.body.appendChild(textArea);
	textArea.focus();
	textArea.select();
	try {
		const successful = document.execCommand("copy");
		if (successful) {
			console.log("Text copied to clipboard");
			toast.info("Copied To clipboard", {
				position: "top-left",
				autoClose: 500,
			});
		} else {
			console.error("Failed to copy text to clipboard");
		}
	} catch (error) {
		console.error("Failed to copy text to clipboard:", error);
	}
	document.body.removeChild(textArea);
	return Promise.resolve();
}
