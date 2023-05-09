export const mockNetworkDelay = (args: any) => {
  const {delay, callback} = args;
  return new Promise((resolve, _reject) => {
    console.warn(`and mock network latency with delay of: ${delay}ms`);
    setTimeout(() => {
      resolve(callback());
    }, delay);
  });
};

export const delay = (ms: number) => new Promise(
  resolve => setTimeout(resolve, ms)
);

export default mockNetworkDelay;