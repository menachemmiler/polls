export const MIN_HEIGHT = 5;
export const MAX_HEIGHT = 30;

export function getBarHeight(optionCount: number) {
  if (optionCount <= 4) return MAX_HEIGHT;
  if (optionCount >= 12) return MIN_HEIGHT;
  return (
    MAX_HEIGHT -
    ((MAX_HEIGHT - MIN_HEIGHT) * (optionCount - 4)) / (12 - 4)
  );
}
