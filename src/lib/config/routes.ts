const routes = {
  routes_user: [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'Inventory', link: '/inventory' },
    { title: 'Necessary Materials', link: '/necessary-materials' },
    { title: 'Orders', link: '/orders' },
    { title: 'Users', link: '/users' },
    { title: 'Settings', link: '/settings' }
  ],
  redirects: {
    auth: {
      toLogin: '/auth/login'
    },
    user: {
      toUserDashboard: '/dashboard'
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
