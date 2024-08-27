export const factorial = (n) => {
    if (n < 0) return 'Error';
    let fact = 1;
    for (let i = 1; i <= n; i++) {
      fact *= i;
    }
    return fact;
  };