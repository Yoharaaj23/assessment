export const getStoredValue = (key, context) => {
  if (key.includes('stored-')) {
    const actualKey = key.replace('stored-', '');
    return context.getData(actualKey);
  }
  return key;
};
