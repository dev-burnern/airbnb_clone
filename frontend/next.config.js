/** @type {import('next').NextConfig} */
const nextConfig = {
  // Next.js에게 소스 코드 디렉토리가 'src'임을 알려줍니다.
  // 이 설정을 추가하면 Next.js는 './src/app' 또는 './src/pages'를 찾습니다.
  experimental: {
    // Note: next.config.js에서 'srcDir' 옵션은 13.x 이후부터 더이상 공식적으로 지원되지 않거나
    // 'src' 디렉토리 자체가 기본적으로 지원되는 경우가 많지만, 명시적으로 설정할 수 있는 방법은
    // 'rootDir'을 지정하거나 Next.js 버전이 이를 지원하는지 확인해야 합니다.
    // 하지만 가장 확실한 방법은 Next.js가 기본적으로 src 폴더를 지원하도록 하는 것입니다.
    // Next.js 13+ 버전에서는 'src' 디렉토리가 있으면 자동으로 인식합니다.

    // 만약 `src` 아래에 `app`이 있는데도 인식을 못 한다면, Next.js 버전을 확인하고,
    // 필요하다면 `next.config.js`에 아래 설정을 추가해 보세요 (버전에 따라 필요할 수 있음).
    // 이 설정은 보통 빌드 디렉토리와 관련된 것이므로, 소스 디렉토리 인식은 Next.js의 내장 기능에 의존해야 합니다.
  },
  // Next.js 13+에서는 `src` 디렉토리를 사용하면 별도의 설정 없이 자동으로 인식하는 것이 원칙입니다.
  // 그럼에도 불구하고 문제가 발생한다면, **Next.js 버전을 확인**해 보세요.

  // 외부 이미지 도메인 허용 (Unsplash 등)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },

  eslint: { ignoreDuringBuilds: true }

};

module.exports = nextConfig;