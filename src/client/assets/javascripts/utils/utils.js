/**
 * Created by chris on 1/9/17.
 */

export const objectWithout = (object, withoutKeys) => {
  const obj = Object.assign({}, object);
  withoutKeys.forEach(key => delete obj[key]);
  return obj;
};
