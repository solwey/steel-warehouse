const routes = {
  routes_user: [
    { title: 'Dashboard', link: '/user/dashboard' },
    { title: 'Inventory', link: '/user/inventory' },
    { title: 'Necessary Materials', link: '/user/necessary-materials' },
    { title: 'Users', link: '/user/users' },
    { title: 'Settings', link: '/user/settings' }
  ],
  redirects: {
    auth: {
      toLogin: '/auth/login'
    },
    user: {
      toUserDashboard: '/user/dashboard'
    }
  },
  footer_nav: {
    about: {
      title: 'About',
      routes: [
        { title: 'Pricing', link: '/' },
        { title: 'FAQ', link: '/' }
      ]
    },
    resources: {
      title: 'Resources',
      routes: [
        { title: 'Blog', link: '/' },
        { title: 'Docs', link: '/' }
      ]
    },
    legal: {
      title: 'Legal',
      routes: [
        { title: 'Privacy Policy', link: '/' },
        { title: 'Terms and Conditions', link: '/' }
      ]
    }
  }
};

export default routes;
