import createNextIntlPlugin from 'next-intl/plugin';
 
const withNextIntl = createNextIntlPlugin('./i18n/request.ts');
 
/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https" as const,
                hostname: "images.unsplash.com",
            },
            {
                protocol: "https" as const,
                hostname: "res.cloudinary.com",
            },
            {
                protocol: "https" as const,
                hostname: "gwdonfwwedbrstsivjeb.supabase.co",
            },
        ],
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
};
 
export default withNextIntl(nextConfig);
