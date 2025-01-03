const toTitleCase = (input: string, delimiter = ' ') => {
  return input
    .toLowerCase()
    .split(delimiter)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export default toTitleCase;
