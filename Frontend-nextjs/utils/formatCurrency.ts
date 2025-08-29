const formatter = new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
});

export function eur(amount: number): string {
    const value = Number(amount);
    return formatter.format(Number.isFinite(value) ? value : 0);
}

