import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge Tailwind CSS classes with clsx
 */
export function cn(...inputs) {
    return twMerge(clsx(inputs))
}

/**
 * Format number as Indonesian Rupiah currency
 */
export function formatCurrency(value) {
    if (!value) return 'Rp 0'
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value)
}

/**
 * Format date to Indonesian locale
 */
export function formatDate(dateString) {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    })
}

/**
 * Format short date (DD/MM/YYYY)
 */
export function formatShortDate(dateString) {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('id-ID')
}
