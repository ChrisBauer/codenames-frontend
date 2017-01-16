/**
 * Created by chris on 1/9/17.
 */

export const objectWithout = (object, withoutKeys) => {
  const obj = Object.assign({}, object);
  withoutKeys.forEach(key => delete obj[key]);
  return obj;
};

export const findLast = (arr, fn) => {
  let i = arr.length;
  while (i-- > 0) {
    if (fn(arr[i])) {
      return arr[i];
    }
  }
};
