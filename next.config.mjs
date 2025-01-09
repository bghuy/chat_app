

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https', // External images served over https
                hostname: 'uploadthing.com',
                pathname: '**',
            },
            {
                protocol: 'https', // External images served over https
                hostname: 'utfs.io',
                pathname: '**',
            },
            {
                protocol: 'https', // External images served over https
                hostname: 'lh3.googleusercontent.com',
                pathname: '**',
            },
        ],
    },
};

export default nextConfig;
