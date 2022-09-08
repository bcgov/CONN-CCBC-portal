export default function checkIntakeValidity(intakeOpenDate, intakeClosingDate, mockDate) {
  const today = Date.now(); 
  const currentDate = mockDate ?? today;

  const isIntakeClosed = intakeClosingDate
    ? Date.parse(intakeClosingDate) < currentDate
    : false;
  const isIntakeOpen = intakeOpenDate
    ? Date.parse(intakeOpenDate) < currentDate
    : false;

  return !isIntakeClosed && isIntakeOpen;
}