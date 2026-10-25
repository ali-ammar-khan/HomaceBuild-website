import { AreaUnitType } from '@/types/database';

/**
 * Standard measurement definitions and conversions for Pakistani real estate.
 * In Islamabad/Rawalpindi (CDA, Bahria Town, DHA):
 * - 1 Kanal = 20 Marlas.
 * - Standard Islamabad/Bahria/DHA residential standard: 1 Marla = 225 sq ft.
 * - Traditional Punjab revenue standard: 1 Marla = 272.25 sq ft.
 * - 1 Sq Yard = 9 Sq Ft.
 */
export const AREA_STANDARDS = {
  BAHRIA_DHA_CDA: 225.0,
  PUNJAB_REVENUE: 272.25,
  PUNJAB_MUNICIPAL: 250.0,
} as const;

export const DEFAULT_MARLA_SQFT = AREA_STANDARDS.BAHRIA_DHA_CDA;
export const MARLA_PER_KANAL = 20.0;
export const SQFT_PER_SQYD = 9.0;

/**
 * Normalizes an area value into Marlas based on the property's local standard.
 */
export function calculateMarla(
  value: number,
  unit: AreaUnitType,
  marlaSqft: number = DEFAULT_MARLA_SQFT
): number {
  if (value <= 0) return 0;
  switch (unit) {
    case 'marla':
      return value;
    case 'kanal':
      return value * MARLA_PER_KANAL;
    case 'sqft':
      return value / marlaSqft;
    case 'sqyd':
      return (value * SQFT_PER_SQYD) / marlaSqft;
    default:
      return value;
  }
}

/**
 * Normalizes an area value into Square Feet based on the property's local standard.
 */
export function calculateSqft(
  value: number,
  unit: AreaUnitType,
  marlaSqft: number = DEFAULT_MARLA_SQFT
): number {
  if (value <= 0) return 0;
  switch (unit) {
    case 'marla':
      return value * marlaSqft;
    case 'kanal':
      return value * MARLA_PER_KANAL * marlaSqft;
    case 'sqft':
      return value;
    case 'sqyd':
      return value * SQFT_PER_SQYD;
    default:
      return value;
  }
}

/**
 * Formats an area for display with appropriate units.
 */
export function formatArea(
  value: number,
  unit: AreaUnitType
): string {
  const formattedValue = Number(value).toLocaleString('en-US', {
    maximumFractionDigits: 2,
  });

  switch (unit) {
    case 'marla':
      return `${formattedValue} Marla`;
    case 'kanal':
      return `${formattedValue} Kanal`;
    case 'sqft':
      return `${formattedValue} Sq. Ft.`;
    case 'sqyd':
      return `${formattedValue} Sq. Yd.`;
    default:
      return `${formattedValue} ${unit}`;
  }
}

/**
 * Formats Pakistani currency (PKR) with Lakh and Crore notations standard in Pakistan.
 */
export function formatPKR(amount: number | null, isPriceOnCall?: boolean): string {
  if (isPriceOnCall || amount === null || amount === undefined) {
    return 'Price on Call';
  }

  if (amount >= 10000000) {
    const crore = amount / 10000000;
    return `PKR ${crore.toFixed(2).replace(/\.00$/, '')} Crore`;
  }

  if (amount >= 100000) {
    const lakh = amount / 100000;
    return `PKR ${lakh.toFixed(2).replace(/\.00$/, '')} Lac`;
  }

  return `PKR ${amount.toLocaleString('en-PK')}`;
}
