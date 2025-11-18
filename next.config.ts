/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [], // adicione domínios externos se necessário
    formats: ['image/webp', 'image/avif'], // formatos suportados
  },
}

module.exports = nextConfig