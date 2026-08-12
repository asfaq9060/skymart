import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Shop from './Pages/Shop.jsx';
import Product from './Pages/Product.jsx';
import ShopCategory from './Pages/ShopCategory.jsx';
import Layout from "./Layout.jsx"
import LoginSignup from './Pages/LoginSingup.jsx'
import Cart from './Pages/Cart.jsx';
import NotFound from './Pages/NotFound.jsx';
import ShopContextProvider from './Context/ShopContext.jsx';
import AuthContextProvider from './Context/AuthContext.jsx';
import OrderSuccess from './Pages/OrderSuccess.jsx';
import Account from './Pages/Account.jsx';
import Admin from './Pages/Admin.jsx';
import men_banner from './components/Assets/Frontend_Assets/banner_mens.png'
import women_banner from './components/Assets/Frontend_Assets/banner_women.png'
import kid_banner from './components/Assets/Frontend_Assets/banner_kids.png'
const router = createBrowserRouter([
  { path: "/", element: <Layout/>,
    children: [
      {path: "/", element: <Shop/>},
      {path: "/mens", element: <ShopCategory banner={men_banner} category="men"/>,},
      {path: "/womens", element: <ShopCategory banner={women_banner} category="women"/>},
      {path: "/kids", element: <ShopCategory banner={kid_banner} category="kid"/>},
      {path: "/product/:productId", element: <Product/>},
      {path: "/cart", element: <Cart/>},
      {path: "/login", element: <LoginSignup/>},
      {path: "/order-success/:orderId", element: <OrderSuccess/>},
      {path: "/account", element: <Account/>},
      {path: "/admin", element: <Admin/>},
      {path: "*", element: <NotFound/>}
    ]
  }
]);
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthContextProvider>
      <ShopContextProvider>
        <RouterProvider router={router} />
      </ShopContextProvider>
    </AuthContextProvider>
  </StrictMode>,
)
