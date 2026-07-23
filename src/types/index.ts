export type CustomizationType = 'radio' | 'checkbox' | 'select'

export interface CustomizationOption {
  id: string
  label: string
  priceModifier: number
}

export interface CustomizationGroup {
  id: string
  label: string
  type: CustomizationType
  required?: boolean
  options: CustomizationOption[]
}

export interface RecipeStep {
  step: number
  title: string
  description: string
}

export interface Product {
  id: string
  name: string
  shortDescription: string
  description: string
  basePrice: number
  image: string
  heroImage: string
  videoUrl: string
  videoPoster: string
  highlights: string[]
  prepTime: string
  rating: number
  reviewCount: number
  ingredients: string[]
  preparationSteps: RecipeStep[]
  cookingInstructions: string[]
  servingSuggestions?: string
  customizations: CustomizationGroup[]
}

export interface SelectedCustomization {
  groupId: string
  groupLabel: string
  optionId: string
  optionLabel: string
  priceModifier: number
}

export interface CartItem {
  id: string
  productId: string
  productName: string
  productImage: string
  basePrice: number
  quantity: number
  customizations: SelectedCustomization[]
  unitPrice: number
  totalPrice: number
}

export interface CustomerInfo {
  fullName: string
  mobileNumber: string
  houseFlat: string
  street: string
  area: string
  city: string
  state: string
  pinCode: string
  landmark: string
}

export interface DeliveryInfo {
  preferredDate: string
  preferredTime: string
}

export interface Order {
  orderId: string
  orderDate: string
  customer: CustomerInfo
  delivery: DeliveryInfo
  items: CartItem[]
  subtotal: number
  deliveryCharge: number
  grandTotal: number
}
