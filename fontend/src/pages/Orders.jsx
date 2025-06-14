import React from 'react'
import useOrderProfiles from '../hooks/orders/useOrderProfiles'

const Orders = () => {
    const {order} = useOrderProfiles();
    console.log(order);
  return (
    <div>
      
    </div>
  )
}

export default Orders
