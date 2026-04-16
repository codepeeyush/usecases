import { Navigate, Route, Routes } from 'react-router-dom'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { CartProvider } from '@/contexts/CartContext'
import Home from '@/pages/Home'
import Shop from '@/pages/Shop'
import ProductDetail from '@/pages/ProductDetail'
import Cart from '@/pages/Cart'
import Checkout from '@/pages/Checkout'
import { summitTrailPaths } from '@/lib/routes'

export default function SummitTrailApp() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1">
          <Routes>
            <Route index element={<Home />} />
            <Route path="shop" element={<Shop />} />
            <Route path="shop/:id" element={<ProductDetail />} />
            <Route path="cart" element={<Cart />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="*" element={<Navigate to={summitTrailPaths.home} replace />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </CartProvider>
  )
}
