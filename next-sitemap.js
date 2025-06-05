/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: '',
  generateRobotsTxt: true,
  changefreq: 'weekly',
  priority: 0.7,
  exclude: ['/user/*', '/dashboard/*']
};
