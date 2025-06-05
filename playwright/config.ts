export const routes = {
  urls: {
    base: 'http://localhost:3000/',
    UserDashboard: 'http://localhost:3000/user/dashboard',
    lemonUrl: 'https://saasstarterkit.lemonsqueezy.com/**'
  },
  segments: {
    authConfirm: '**/auth/confirmed',
    userDash: '**/user/**',
    login: '**/auth/login'
  },
  api: {
    emails: `http://localhost:1080/email`
  },
  filePath: {
    userFile: 'playwright/.auth/user.json',
    adminFile: 'playwright/.auth/admin.json'
  }
};

export const user = {
  admin: { email: 'test4@yahoo.com' }
};

export const org = {
  org1: 'org1',
  orgTodo: 'orgTodo'
};

export const todo = {
  todoTitle: 'todo1',
  todoDescription: 'todo description 1'
};
