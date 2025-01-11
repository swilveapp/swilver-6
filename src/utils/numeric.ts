export const parseNumeric = (value: string | number): number => {
  if (typeof value === 'string') {
    return parseFloat(value);
  }
  return value;
};

export const toNumeric = (value: number): string => {
  return value.toFixed(2);
};