import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate
} from "react-router-dom";
import { Provider } from 'react-redux';
import store from './components/stm/store.js';
import Warehouse from "./components/apps/warehouse/Warehouse.jsx";
import Messager from "./components/apps/messager/Messager.jsx";
import Crm from "./components/apps/crm/Crm.jsx";
import Orders from "./components/apps/warehouse/pages/orders/Orders.jsx";
import Products from "./components/apps/warehouse/pages/products/Products.jsx";
import Remains from "./components/apps/warehouse/pages/remains/Remains.jsx";
import Parties from "./components/apps/warehouse/pages/parties/Parties.jsx";
import Order from "./components/apps/warehouse/pages/neworder/Order.jsx";
import OrderData from './components/apps/warehouse/pages/neworder/orderDetails/OrderData.jsx';
import ProductData from './components/apps/warehouse/pages/product/productDetails/ProductData.jsx';
import ProductFiles from './components/apps/warehouse/pages/product/productFiles/ProductFiles.jsx';
import ProductPage from './components/apps/warehouse/pages/product/ProductPage.jsx';
import Login from './components/login/Login.jsx';
import RegForm from './components/regForm/RegForm.jsx';
import PrivateRoute from './components/apps/PrivateRoute.jsx';
import AuthStore from "./AuthStore.js";
import ProfilePage from './components/apps/profilePage/ProfilePage.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <PrivateRoute />,
    children: [
      {
        path: "/",
        element: <Warehouse />,
        children: [
          {
            path: "",
            element: <Navigate to="orders" replace />,
          },
          {
            path: "orders",
            element: <Orders />,
          },
          {
            path: "orders/:id",
            element: <Order />,
            children: [
              {
                path: "",
                element: <Navigate to="orderdata" replace />,
              },
              {
                path: "orderdata",
                element: <OrderData configName='orderPageConfig' />,
              }
            ]
          },
          {
            path: "orders/neworder",
            element: <Order />,
            children: [
              {
                path: "",
                element: <Navigate to="orderdata" replace />,
              },
              {
                path: "orderdata",
                element: <OrderData />,
              }
            ]
          },
          {
            path: "products",
            element: <Products />,
            children: [
              {
                path: "",
                element: <Navigate to="productdata" replace />,
              },
              {
                path: "productdata",
                element: <ProductData />,
              }
            ]
          },
          {
            path: "products/:id",
            element: <ProductPage />,
            children: [
              {
                path: "",
                element: <Navigate to="data" replace />,
              },
              {
                path: "data",
                element: <ProductData />,
              },
              {
                path: "files",
                element: <ProductFiles />,
              }
            ]
          },
          {
            path: "remains",
            element: <Remains />,
          },
          {
            path: "parties",
            element: <Parties />,
          },
        ]
      },
      {
        path: "/messager",
        element: <Messager />,
      },
      {
        path: "/crm",
        element: <Crm />,
      },
      {
        path: "/profile",
        element: <ProfilePage />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/sign-up",
    element: <RegForm />, 
  },
]);

AuthStore.initializeAuthState();

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
  // </React.StrictMode>,
);