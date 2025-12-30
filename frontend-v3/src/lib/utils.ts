import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatCurrency(value: number | null | undefined): string {
    if (value === null || value === undefined) return "-"
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value)
}

export function formatNumber(value: number | null | undefined): string {
    if (value === null || value === undefined) return "-"
    return new Intl.NumberFormat("id-ID").format(value)
}

export function formatDate(value: string | null | undefined): string {
    if (!value) return "-"
    return new Intl.DateTimeFormat("id-ID", {
        year: "numeric",
        month: "short",
        day: "numeric",
    }).format(new Date(value))
}

export function truncate(str: string, length: number): string {
    if (!str) return ""
    return str.length > length ? `${str.slice(0, length)}...` : str
}
