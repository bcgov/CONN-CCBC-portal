const formatPhone = (number: any) => {
  const numWithoutDashes = number.replace(/[^0-9]/g, '');
  if (numWithoutDashes.length > 10) return number.slice(0, -1);
  const dashPlaces = [3, 6];
  return numWithoutDashes
    .split('')
    .reduce(
      (previous: string, current: number, i: number) =>
        dashPlaces.includes(i)
          ? [...previous, '-', current]
          : [...previous, current],
      []
    )
    .join('');
};

export default formatPhone;
