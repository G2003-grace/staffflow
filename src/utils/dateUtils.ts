export function countWorkingDays(start: Date, end: Date) {
  let count = 0;
  const current = new Date(start);

  while (current <= end) {
    const day = current.getDay();

    
    if (day !== 0 && day !== 6) {
      count++;
    }

    current.setDate(current.getDate() + 1);
  }

  return count;
}