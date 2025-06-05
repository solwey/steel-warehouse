export const PrismaDBError = (err: Error) => {
  if (err) {
    console.log(err);
    throw err;
  }
};

export const AuthError = (err: Error) => {
  if (err) {
    console.log(err);
    throw err;
  }
};

export const WebhookError = (err: Error) => {
  if (err) {
    console.log(err);
    throw err;
  }
};
