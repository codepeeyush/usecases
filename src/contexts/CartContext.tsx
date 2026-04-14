import { createContext, useContext, useReducer, type ReactNode } from 'react'
import { type Product } from '@/data/products'

export type CartItem = {
  product: Product
  size: string
  color: string
  quantity: number
}

type CartState = { items: CartItem[] }

type CartAction =
  | { type: 'ADD'; payload: { product: Product; size: string; color: string } }
  | { type: 'REMOVE'; payload: { id: string; size: string; color: string } }
  | { type: 'UPDATE_QTY'; payload: { id: string; size: string; color: string; quantity: number } }
  | { type: 'CLEAR' }

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD': {
      const { product, size, color } = action.payload
      const existing = state.items.findIndex(
        i => i.product.id === product.id && i.size === size && i.color === color
      )
      if (existing !== -1) {
        const items = [...state.items]
        items[existing] = { ...items[existing], quantity: items[existing].quantity + 1 }
        return { items }
      }
      return { items: [...state.items, { product, size, color, quantity: 1 }] }
    }
    case 'REMOVE': {
      const { id, size, color } = action.payload
      return { items: state.items.filter(i => !(i.product.id === id && i.size === size && i.color === color)) }
    }
    case 'UPDATE_QTY': {
      const { id, size, color, quantity } = action.payload
      if (quantity <= 0) {
        return { items: state.items.filter(i => !(i.product.id === id && i.size === size && i.color === color)) }
      }
      return {
        items: state.items.map(i =>
          i.product.id === id && i.size === size && i.color === color ? { ...i, quantity } : i
        ),
      }
    }
    case 'CLEAR':
      return { items: [] }
    default:
      return state
  }
}

type CartContextValue = {
  items: CartItem[]
  totalItems: number
  subtotal: number
  dispatch: React.Dispatch<CartAction>
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] })

  const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0)
  const subtotal = state.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0)

  return (
    <CartContext.Provider value={{ items: state.items, totalItems, subtotal, dispatch }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
