import { use, useCallback, useContext, useState } from 'react'
import { ShopContext } from '../../context/ShopContext'

const useCreateCart = () => {
  const [message, setMessage] = useState(null)
  const { accessToken } = useContext(ShopContext)

  const createCart = async (productVariantId, quantity) => {
    try {
      const response = await fetch('http://localhost:5001/api/v1/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ productVariantId, quantity }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setMessage(data.message)

      return data
    } catch (error) {
      console.error('Error creating cart:', error)
      throw error
    }
  }
  return { createCart, message }
}

export default useCreateCart
