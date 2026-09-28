// Standard Payment Method Helper for GRID Clothing
// Supports exact user-defined billing tags: 'G-Pay', 'P-Pay', and 'Cash on delivery'
// Merchant payment recipient phone: 9611856691 for online direct payments (G-Pay, P-Pay)

export const MERCHANT_PAYMENT_PHONE = '9611856691';
export const MERCHANT_PAYMENT_PHONE_FORMATTED = '+91 9611856691';
export const MERCHANT_UPI_VPA = '9611856691@upi';
export const MERCHANT_NAME = 'GRID Clothing';

export type StandardPaymentType = 'gpay' | 'phonepe' | 'cod' | 'card' | 'other';

export interface BillPaymentInfo {
  type: StandardPaymentType;
  billLabel: 'G-Pay' | 'P-Pay' | 'Cash on delivery' | string;
  badgeLabel: string;
  channel: string;
  status: string;
  description: string;
  details: string;
  recipientPhone?: string;
  isPaidToPhone?: boolean;
  colorClass: {
    bg: string;
    text: string;
    border: string;
    badge: string;
  };
}

/**
 * Standardizes any paymentMethod string into the exact bill representation requested:
 * - Paid by G-Pay -> in bill "G-Pay"
 * - Paid by PhonePe / P-Pay -> in bill "P-Pay"
 * - Paid by Cash on delivery -> in bill "Cash on delivery"
 * Recognizes and displays direct transfer to merchant phone number 9611856691
 */
export function getBillPaymentInfo(rawMethod?: string | null): BillPaymentInfo {
  const method = (rawMethod || '').trim();
  const lower = method.toLowerCase();
  const mentionsPhone = lower.includes('9611856691') || lower.includes('phone') || lower.includes('phno');

  // 1. Google Pay / G-Pay
  if (
    lower.includes('gpay') ||
    lower.includes('g-pay') ||
    lower.includes('google pay') ||
    lower.includes('g pay')
  ) {
    return {
      type: 'gpay',
      billLabel: 'G-Pay',
      badgeLabel: mentionsPhone ? 'G-Pay (Ph: 9611856691)' : 'G-Pay Direct UPI',
      channel: mentionsPhone
        ? 'Online Direct Pay to Phone 9611856691 (G-Pay)'
        : 'Online Direct Pay (G-Pay)',
      status: 'Paid Online via G-Pay',
      description: mentionsPhone
        ? 'Online Direct Payment to Phone 9611856691 via Google Pay UPI'
        : 'Authorized 1-tap Direct UPI Online Payment via Google Pay',
      details: method,
      recipientPhone: mentionsPhone ? MERCHANT_PAYMENT_PHONE : undefined,
      isPaidToPhone: mentionsPhone,
      colorClass: {
        bg: 'bg-cyan-50/80',
        text: 'text-cyan-800',
        border: 'border-cyan-300',
        badge: 'bg-cyan-600 text-white border-cyan-700',
      },
    };
  }

  // 2. PhonePe / P-Pay
  if (
    lower.includes('phonepe') ||
    lower.includes('p-pay') ||
    lower.includes('phone pay') ||
    lower.includes('ppay') ||
    lower.includes('p pay')
  ) {
    return {
      type: 'phonepe',
      billLabel: 'P-Pay',
      badgeLabel: mentionsPhone ? 'P-Pay (Ph: 9611856691)' : 'P-Pay Direct UPI',
      channel: mentionsPhone
        ? 'Online Direct Pay to Phone 9611856691 (P-Pay)'
        : 'Online Direct Pay (P-Pay)',
      status: 'Paid Online via P-Pay',
      description: mentionsPhone
        ? 'Online Direct Payment to Phone 9611856691 via PhonePe (P-Pay)'
        : 'Authorized 1-tap Direct UPI Online Payment via PhonePe (P-Pay)',
      details: method,
      recipientPhone: mentionsPhone ? MERCHANT_PAYMENT_PHONE : undefined,
      isPaidToPhone: mentionsPhone,
      colorClass: {
        bg: 'bg-purple-50/80',
        text: 'text-purple-800',
        border: 'border-purple-300',
        badge: 'bg-purple-700 text-white border-purple-800',
      },
    };
  }

  // 3. Cash on delivery
  if (
    lower.includes('cod') ||
    lower.includes('cash on delivery') ||
    lower.includes('cash')
  ) {
    return {
      type: 'cod',
      billLabel: 'Cash on delivery',
      badgeLabel: 'Cash on delivery',
      channel: 'Doorstep Cash / Scan QR on Arrival',
      status: 'Payable on Delivery (Doorstep)',
      description: 'Cash on delivery - To be collected by courier executive at doorstep',
      details: 'Cash on delivery',
      colorClass: {
        bg: 'bg-emerald-50/80',
        text: 'text-emerald-800',
        border: 'border-emerald-300',
        badge: 'bg-emerald-700 text-white border-emerald-800',
      },
    };
  }

  // Fallback for card / other
  return {
    type: 'other',
    billLabel: method || 'Standard Payment',
    badgeLabel: method || 'Standard Payment',
    channel: 'Direct Payment Gateway',
    status: 'Confirmed',
    description: method || 'Standard electronic settlement',
    details: method,
    colorClass: {
      bg: 'bg-neutral-100',
      text: 'text-neutral-800',
      border: 'border-neutral-300',
      badge: 'bg-neutral-800 text-white border-neutral-900',
    },
  };
}

/**
 * Generates standard UPI payment link to phone number 9611856691
 */
export function generateUpiUri(amount: number, orderRef?: string): string {
  const am = Math.max(0, amount).toFixed(2);
  const note = orderRef ? `GRID Order ${orderRef}` : 'GRID Clothing Purchase';
  return `upi://pay?pa=${encodeURIComponent(MERCHANT_UPI_VPA)}&pn=${encodeURIComponent(
    MERCHANT_NAME
  )}&am=${am}&cu=INR&tn=${encodeURIComponent(note)}`;
}

/**
 * Generates Google Pay direct intent link
 */
export function generateGPayIntentUri(amount: number, orderRef?: string): string {
  const am = Math.max(0, amount).toFixed(2);
  const note = orderRef ? `GRID Order ${orderRef}` : 'GRID Clothing Purchase';
  return `tez://upi/pay?pa=${encodeURIComponent(MERCHANT_UPI_VPA)}&pn=${encodeURIComponent(
    MERCHANT_NAME
  )}&am=${am}&cu=INR&tn=${encodeURIComponent(note)}`;
}

/**
 * Generates PhonePe direct intent link
 */
export function generatePhonePeIntentUri(amount: number, orderRef?: string): string {
  const am = Math.max(0, amount).toFixed(2);
  const note = orderRef ? `GRID Order ${orderRef}` : 'GRID Clothing Purchase';
  return `phonepe://pay?pa=9611856691@ybl&pn=${encodeURIComponent(
    MERCHANT_NAME
  )}&am=${am}&cu=INR&tn=${encodeURIComponent(note)}`;
}

/**
 * Generates QR Code image URL for payment to 9611856691
 */
export function getUpiQrCodeUrl(amount: number, orderRef?: string): string {
  const upiUri = generateUpiUri(amount, orderRef);
  return `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=10&data=${encodeURIComponent(
    upiUri
  )}`;
}
