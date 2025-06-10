import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext';

const Profile = () => {
    const {user} = useContext(ShopContext);
    console.log(user);
  return (
    <div>
      <p>{user}</p>
    </div>
  )
}

export default Profile
