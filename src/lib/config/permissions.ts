import { Actions, Subjects } from '../types/enums';

export const permissions = {
  owner: [{ action: Actions.MANAGE, subject: Subjects.ALL }],
  admin: [{ action: Actions.READ, subject: Subjects.ALL }],
  member: [
    { action: Actions.CREATE, subject: Subjects.TODO },
    { action: Actions.READ, subject: Subjects.TODO },
    { action: Actions.UPDATE, subject: Subjects.TODO }
  ]
};
