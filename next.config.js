/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false,
	swcMinify: true,
	images: {
		domains: ["res.cloudinary.com"],
	},
	redirects() {
		return [
			{
				source: "/dashboard",
				destination: "/",
				permanent: true,
			},
		];
	},
};

module.exports = nextConfig;
