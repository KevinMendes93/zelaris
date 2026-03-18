export type DateRange = { startDate: string; endDate: string };

export function parseDateRange(input: string): DateRange | null {
  const match = input.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return null;

  const [, day, month, year] = match;
  const base = `${year}-${month}-${day}`;

  return {
    startDate: `${base} 00:00:00`,
    endDate: `${base} 23:59:59.999`,
  };
}

export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
