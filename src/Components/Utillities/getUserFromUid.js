export const getUserFromUid = (uid, users) =>
  users?.find((user) => user.uid === uid);
