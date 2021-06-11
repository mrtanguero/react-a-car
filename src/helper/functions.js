export const currentTotalLength = (arr) => {
  return arr.reduce((sum, cur) => sum + cur.data.data.length, 0);
};
