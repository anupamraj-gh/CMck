import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import { Layout } from '@/components/layout/Layout'
import { HomePage } from '@/pages/HomePage'
import { ProductPage } from '@/pages/ProductPage'
import { CheckoutPage } from '@/pages/CheckoutPage'
import { LaunchOfferPage } from '@/pages/LaunchOfferPage'
import { RemoteContentSync } from '@/components/RemoteContentSync'

export default function App() {
  return (
    <>
      <RemoteContentSync />
      <MotionConfig reducedMotion="user">
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="launch-offer" element={<LaunchOfferPage />} />
              <Route path="product/:id" element={<ProductPage />} />
              <Route path="checkout" element={<CheckoutPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </MotionConfig>
    </>
  )
}
