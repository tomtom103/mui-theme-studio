// Spacing token system
export const defaultSpacingTokens = {
  baseUnit: 8,
  scale: 'linear' as const,
  steps: [0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64],
};

export const createSpacingScale = (baseUnit: number, scale: 'linear' | 'exponential', count: number) => {
  const steps: number[] = [];
  
  for (let i = 0; i < count; i++) {
    if (scale === 'linear') {
      steps.push(baseUnit * i);
    } else {
      steps.push(Math.pow(baseUnit, i));
    }
  }
  
  return steps;
};
