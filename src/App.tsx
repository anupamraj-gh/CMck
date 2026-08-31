import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import { Layout } from '@/components/layout/Layout'
import { HomePage } from '@/pages/HomePage'
import { ProductPage } from '@/pages/ProductPage'
import { CheckoutPage } from '@/pages/CheckoutPage'

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      {/* Must match vite.config.ts's `base` — GitHub Pages serves this site from /CMck/, not
          the domain root, so client-side route links need the same prefix. */}
      <BrowserRouter basename="/CMck">
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="product/:id" element={<ProductPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </MotionConfig>
  )
}
