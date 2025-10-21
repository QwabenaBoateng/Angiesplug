import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useStore = create(
  persist(
    (set, get) => ({
      // User state
      user: null,
      setUser: (user) => {
        console.log('Store - setUser called with:', user ? 'user object' : 'null')
        set({ user })
      },
      
      // Cart state
      cart: [],
      addToCart: (product, quantity = 1) => {
        const existingItem = get().cart.find(item => item.id === product.id)
        if (existingItem) {
          set(state => ({
            cart: state.cart.map(item =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            )
          }))
        } else {
          set(state => ({
            cart: [...state.cart, { ...product, quantity }]
          }))
        }
      },
      removeFromCart: (productId) => {
        set(state => ({
          cart: state.cart.filter(item => item.id !== productId)
        }))
      },
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId)
        } else {
          set(state => ({
            cart: state.cart.map(item =>
              item.id === productId ? { ...item, quantity } : item
            )
          }))
        }
      },
      clearCart: () => set({ cart: [] }),
      
      // UI state
      isLoading: false,
      setLoading: (loading) => set({ isLoading: loading }),
      
      // Search and filters
      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),
      filters: {
        category: '',
        priceRange: [0, 1000],
        size: '',
        color: ''
      },
      setFilters: (filters) => set({ filters }),
    }),
    {
      name: 'angiesplug-store',
      partialize: (state) => ({ 
        cart: state.cart,
        user: state.user 
      }),
      // Ensure proper hydration across environments
      skipHydration: false,
    }
  )
)

