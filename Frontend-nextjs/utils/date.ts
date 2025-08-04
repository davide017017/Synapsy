export function toDateInputValue(date: Date): string {
    const tz = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - tz).toISOString().split("T")[0];
}

