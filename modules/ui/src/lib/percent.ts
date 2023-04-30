// Format the percentage expressed as 0..100 to a number with 2 decimal places.
// we never want to round 99.999% to 100% because makes the experience bad so we can't just use toFixed(2) immediately
// Also make sure that whatever is displaying this is using a monospace font so that the numbers don't jump around
export const formatPercent = (percent?: number) => {
  if (!percent) {
    return "0.00";
  }
  return (Math.floor(percent * 100) / 100).toFixed(2);
};
