import jsPDF from 'jspdf'
import type { Order } from '@/types'
import { formatCurrency } from '@/lib/utils'
import { SITE_CONFIG } from '@/config/site'

export function generateInvoicePdf(order: Order): jsPDF {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  let y = 20

  doc.setFillColor(201, 169, 98)
  doc.rect(0, 0, pageWidth, 35, 'F')

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(22)
  doc.text(SITE_CONFIG.brandName, 20, 22)
  doc.setFontSize(10)
  doc.text(SITE_CONFIG.tagline, 20, 30)

  y = 50
  doc.setTextColor(26, 26, 26)
  doc.setFontSize(16)
  doc.text('INVOICE', 20, y)

  y += 10
  doc.setFontSize(10)
  doc.setTextColor(107, 101, 96)
  doc.text(`Order ID: ${order.orderId}`, 20, y)
  doc.text(`Date: ${order.orderDate}`, pageWidth - 20, y, { align: 'right' })

  y += 15
  doc.setTextColor(26, 26, 26)
  doc.setFontSize(12)
  doc.text('Customer Details', 20, y)

  y += 7
  doc.setFontSize(10)
  doc.setTextColor(107, 101, 96)
  doc.text(`${order.customer.fullName} | ${order.customer.mobileNumber}`, 20, y)

  y += 6
  const address = [
    order.customer.houseFlat,
    order.customer.street,
    order.customer.area,
    `${order.customer.city}, ${order.customer.state} - ${order.customer.pinCode}`,
  ]
    .filter(Boolean)
    .join(', ')
  doc.text(address, 20, y, { maxWidth: pageWidth - 40 })

  y += 12
  doc.setTextColor(26, 26, 26)
  doc.setFontSize(12)
  doc.text('Delivery Schedule', 20, y)
  y += 7
  doc.setFontSize(10)
  doc.setTextColor(107, 101, 96)
  doc.text(`${order.delivery.preferredDate} | ${order.delivery.preferredTime}`, 20, y)

  y += 15
  doc.setDrawColor(229, 229, 229)
  doc.line(20, y, pageWidth - 20, y)
  y += 10

  doc.setTextColor(26, 26, 26)
  doc.setFontSize(11)
  doc.text('Item', 20, y)
  doc.text('Qty', pageWidth - 80, y)
  doc.text('Price', pageWidth - 20, y, { align: 'right' })

  y += 5
  doc.line(20, y, pageWidth - 20, y)
  y += 8

  for (const item of order.items) {
    doc.setFontSize(10)
    doc.setTextColor(26, 26, 26)
    doc.text(item.productName, 20, y)

    if (item.customizations.length > 0) {
      y += 5
      doc.setFontSize(8)
      doc.setTextColor(107, 101, 96)
      const customText = item.customizations.map((c) => c.optionLabel).join(', ')
      doc.text(customText, 25, y, { maxWidth: pageWidth - 100 })
    }

    doc.setFontSize(10)
    doc.setTextColor(26, 26, 26)
    doc.text(String(item.quantity), pageWidth - 80, y)
    doc.text(formatCurrency(item.totalPrice), pageWidth - 20, y, { align: 'right' })

    y += 10

    if (y > 250) {
      doc.addPage()
      y = 20
    }
  }

  y += 5
  doc.line(20, y, pageWidth - 20, y)
  y += 10

  doc.setFontSize(10)
  doc.text('Subtotal', pageWidth - 80, y)
  doc.text(formatCurrency(order.subtotal), pageWidth - 20, y, { align: 'right' })

  y += 7
  doc.text('Delivery Charge', pageWidth - 80, y)
  doc.text(
    order.deliveryCharge === 0 ? 'FREE' : formatCurrency(order.deliveryCharge),
    pageWidth - 20,
    y,
    { align: 'right' },
  )

  y += 10
  doc.setFontSize(12)
  doc.setTextColor(201, 169, 98)
  doc.text('Grand Total', pageWidth - 80, y)
  doc.text(formatCurrency(order.grandTotal), pageWidth - 20, y, { align: 'right' })

  y += 20
  doc.setFontSize(9)
  doc.setTextColor(107, 101, 96)
  doc.text(`Thank you for ordering from ${SITE_CONFIG.brandName}!`, pageWidth / 2, y, { align: 'center' })
  doc.text('Payment will be collected upon order confirmation via WhatsApp.', pageWidth / 2, y + 6, {
    align: 'center',
  })

  return doc
}

export function downloadInvoice(order: Order): void {
  const doc = generateInvoicePdf(order)
  doc.save(`invoice-${order.orderId}.pdf`)
}
