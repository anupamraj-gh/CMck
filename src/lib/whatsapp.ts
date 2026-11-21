import type { Order } from '@/types'
import { formatCurrency } from '@/lib/utils'
import { SITE_CONFIG } from '@/config/content'

export function buildWhatsAppMessage(order: Order): string {
  const lines: string[] = [
    `🍽️ *New Order - ${SITE_CONFIG.brandName}*`,
    '',
    `📋 *Order ID:* ${order.orderId}`,
    `📅 *Order Date:* ${order.orderDate}`,
    '',
    '👤 *Customer Details*',
    `Name: ${order.customer.fullName}`,
    `Phone: ${order.customer.mobileNumber}`,
    '',
    '📍 *Delivery Location*',
    `Address: ${order.customer.address}`,
    `PIN Code: ${order.customer.pinCode}`,
    `Google Location: ${order.customer.googleLocation ?? ''}`,
  ]

  lines.push(
    '',
    '🕐 *Delivery Schedule*',
    `Date: ${order.delivery.preferredDate}`,
    `Time: ${order.delivery.preferredTime}`,
    '',
    '🛒 *Order Items*',
  )

  for (const item of order.items) {
    lines.push('')
    lines.push(`*${item.productName}* x${item.quantity}`)
    if (item.customizations.length > 0) {
      const customizations = item.customizations
        .map((c) => `  • ${c.groupLabel}: ${c.optionLabel}`)
        .join('\n')
      lines.push(customizations)
    }
    lines.push(`  Price: ${formatCurrency(item.totalPrice)}`)
  }

  lines.push(
    '',
    '💰 *Payment Summary*',
    `Subtotal: ${formatCurrency(order.subtotal)}`,
    `Delivery: ${order.deliveryCharge === 0 ? 'FREE' : formatCurrency(order.deliveryCharge)}`,
    `*Grand Total: ${formatCurrency(order.grandTotal)}*`,
    '',
    'Please confirm my order. Thank you! 🙏',
  )

  return lines.join('\n')
}

export function redirectToWhatsApp(order: Order): void {
  const message = buildWhatsAppMessage(order)
  const encoded = encodeURIComponent(message)
  const url = `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encoded}`
  window.open(url, '_blank')
}
