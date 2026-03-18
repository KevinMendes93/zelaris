export function parseBooleanQuery(value?: string): boolean | null {
  if (value === undefined || value === '') return null;
  if (value === 'true') return true;
  if (value === 'false') return false;
  return null;
}
