// Function to return TS number given a start date and a delay in hours
// excluding non business days
const calculateDelayTs = (startDate: Date, delayInHours: number): number => {
  let hoursAdded = 0;
  const current = new Date(startDate);
  while (hoursAdded < delayInHours) {
    // Only count if it's not Saturday (6) or Sunday (0)
    if (current.getDay() !== 0 && current.getDay() !== 6) {
      hoursAdded++;
    }
    current.setHours(current.getHours() + 1);
  }
  return current.getTime();
};

export default calculateDelayTs;
