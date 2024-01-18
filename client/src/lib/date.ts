export function formatDate(date: string | Date): string {
    const dateObj = date instanceof Date ? date : new Date(date);
    if (isNaN(dateObj.valueOf()))
        return "";
    const formatter = new Intl.DateTimeFormat("fr-FR", { dateStyle: "short", timeStyle: "short" });
    return formatter.format(dateObj);
}

export function formatDateField (date: Date | null): string {
    if (!date) return '';
    
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    
    return `${year}-${month}-${day}`;
}

export const isSameDay = (a: Date, b: Date) =>
	a.getFullYear() === b.getFullYear()
	&& a.getMonth() === b.getMonth()
	&& a.getDay() === b.getDay();

export const nextDay = (day: Date) => new Date(day.getFullYear(), day.getMonth(), day.getDate() + 1);

export const stripTimeFromDay = (day: Date) => new Date(day.getFullYear(), day.getMonth(), day.getDate());
