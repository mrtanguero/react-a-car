export const totalCurrentLength = (arr) => {
  return arr.reduce((sum, cur) => sum + cur.data.data.length, 0);
};
