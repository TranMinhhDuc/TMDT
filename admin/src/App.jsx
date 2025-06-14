import { useContext } from 'react'
import { AdminContext } from './context/AdminContext'
import Navbar from './component/Navbar'
import Sidebar from './component/Sidebar'
import { Routes, Route } from 'react-router-dom'
import AddProduct from './pages/AddProduct'
import OrderList from './pages/OrderList'
import UserList from './pages/UserList'
import ProductList from './pages/ProductList'
import Login from './component/Login'

function App() {
  const { accessToken } = useContext(AdminContext);

  return (
    <div className='bg-gray-50 min-h-screen'>
      {!accessToken ? (
        <Login />
      ) : (
        <>
          <Navbar />
          <hr className='bg-gray-50' />
          <div className='flex w-full'>
            <Sidebar />
            <div className='flex-1 p-4'>
              <Routes>
                <Route path='/add' element={<AddProduct />} />
                <Route path='/order' element={<OrderList />} />
                <Route path='/user' element={<UserList />} />
                <Route path='/product' element={<ProductList />} />
              </Routes>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
