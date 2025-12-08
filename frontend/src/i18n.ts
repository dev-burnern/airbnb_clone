import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async () => {
    // 기본 언어는 한국어
    const locale = 'ko';

    return {
        locale,
        messages: (await import(`../messages/${locale}.json`)).default
    };
});
