export const handleSpecialExceptions = (expression) => {
    if (expression.includes('log(0)')) {
      return 'Infinity';
    }
    return null;
  };

