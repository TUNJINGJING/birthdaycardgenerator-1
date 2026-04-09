/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://www.birthdaycardgenerator.com',
  generateRobotsTxt: true,
  changefreq: 'weekly',
  priority: 0.7,
  exclude: ['/dashboard', '/legal/*', '/share/*', '/api/*'],
  robotsTxtOptions: {
    additionalSitemaps: [],
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard', '/legal/', '/api/'],
      },
      {
        userAgent: 'GPTBot',
        allow: ['/', '/llms.txt'],
        disallow: ['/dashboard', '/legal/', '/api/'],
      },
    ],
  },
}
