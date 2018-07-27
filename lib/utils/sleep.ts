export const sleep = (timeInMs: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, timeInMs));