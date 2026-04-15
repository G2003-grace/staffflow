export function hasOverlap(
  aStart: Date,
  aEnd: Date,
  bStart: Date,
  bEnd: Date
) {
  return (
    new Date(aStart) <= new Date(bEnd) &&
    new Date(aEnd) >= new Date(bStart)
  );
}