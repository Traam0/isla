//must be used with await
export async function convertToBase64(image: File):Promise<string> {
	return new Promise((resolve, reject) => {
		const fileReader = new FileReader();
		fileReader.readAsDataURL(image);

		fileReader.onload = () => {
			resolve(fileReader.result as string);
		};

		fileReader.onerror = (error) => {
			reject(error);
		};
	});
}
