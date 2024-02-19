export function getHigherSort(items: any[]) {
  const sorts = items.map(item => item.sort);

  if (sorts.length === 0) {
    return 1;
  }

  return Math.max(...sorts) + 1;
}
