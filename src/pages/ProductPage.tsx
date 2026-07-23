import { useState, useMemo, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import { getProductById } from '@/data/products'
import { RecipeVideo } from '@/components/product/RecipeVideo'
import { ProductHero } from '@/components/product/ProductHero'
import { RecipeSection } from '@/components/product/RecipeSection'
import { CustomizationSection } from '@/components/product/CustomizationSection'
import { OrderActions } from '@/components/product/OrderActions'
import {
  useCartStore,
  buildDefaultSelections,
  selectionsToCustomizations,
  calculateUnitPrice,
} from '@/store/cartStore'
import { Button } from '@/components/ui/button'

export function ProductPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const addItem = useCartStore((s) => s.addItem)
  const product = getProductById(id ?? '')

  const [selections, setSelections] = useState<Record<string, string | string[]>>({})
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)

  useEffect(() => {
    if (product) {
      setSelections(buildDefaultSelections(product.customizations))
    }
  }, [product])

  const customizations = useMemo(() => {
    if (!product) return []
    return selectionsToCustomizations(product.customizations, selections)
  }, [product, selections])

  const unitPrice = useMemo(() => {
    if (!product) return 0
    return calculateUnitPrice(product.basePrice, customizations)
  }, [product, customizations])

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-4">
        <span className="font-hand text-3xl text-ink">Hmm, that page fell off the notebook</span>
        <p className="text-ink-soft">We couldn&apos;t find that product.</p>
        <Button variant="coral" asChild>
          <Link to="/">Back to Home</Link>
        </Button>
      </div>
    )
  }

  const handleSelectionChange = (groupId: string, value: string | string[]) => {
    setSelections((prev) => ({ ...prev, [groupId]: value }))
    setAddedToCart(false)
  }

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      productName: product.name,
      productImage: product.image,
      basePrice: product.basePrice,
      quantity,
      customizations,
      unitPrice,
    })
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 3000)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-4">
        <Button variant="ghost" size="sm" className="rounded-full" onClick={() => navigate('/')}>
          <ArrowLeft className="h-4 w-4" />
          Back to Menu
        </Button>
      </div>

      <RecipeVideo
        videoUrl={product.videoUrl}
        poster={product.videoPoster}
        productName={product.name}
      />
      <ProductHero product={product} />
      <RecipeSection product={product} />
      <CustomizationSection
        groups={product.customizations}
        selections={selections}
        onSelectionChange={handleSelectionChange}
        unitPrice={unitPrice}
      />
      <OrderActions
        quantity={quantity}
        unitPrice={unitPrice}
        onQuantityChange={setQuantity}
        onAddToCart={handleAddToCart}
      />

      {addedToCart && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9, rotate: -4 }}
          animate={{ opacity: 1, y: 0, scale: 1, rotate: -2 }}
          exit={{ opacity: 0, y: 30, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 260, damping: 18 }}
          className="fixed bottom-28 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-6 py-3 rounded-full bg-ink text-cream craft-shadow-lg font-bold"
        >
          <CheckCircle className="h-5 w-5 text-butter" />
          Added to cart!
        </motion.div>
      )}
    </motion.div>
  )
}
