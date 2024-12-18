const joinWithAnd = (array: string[]): string => {
  if (array.length === 0) return '';
  if (array.length === 1) return array[0];
  const lastField = array.pop();
  return `${array.join(', ')} and ${lastField}`;
};

export default joinWithAnd;
