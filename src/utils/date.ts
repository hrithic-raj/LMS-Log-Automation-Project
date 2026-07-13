export function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}

export function parseDate(date: string) {
  const [day, month, year] = date
    .split("-")
    .map(Number);

  return {
    day,
    month,
    year,
  };
}

export function isToday(date: string): boolean {
  return date === formatDate(new Date());
}

export function formatLmsInputDate(
  date: string
): string {

  const { day, month, year } =
    parseDate(date);

  return (
    String(day).padStart(2, "0") +
    String(month).padStart(2, "0") +
    String(year)
  );

}