/**
 * Created by chris on 1/8/17.
 */

export const validateUser = (users, currentUserId) => {
  return currentUserId != null && users[currentUserId];
};
