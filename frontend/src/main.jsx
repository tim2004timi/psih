import React, { useEffect, lazy } from 'react';
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

const Orders = lazy(() => import("./components/apps/warehouse/pages/orders/Orders.jsx"));
const Products = lazy(() => import("./components/apps/warehouse/pages/products/Products.jsx"));
const Remains = lazy(() => import("./components/apps/warehouse/pages/remains/Remains.jsx"));
const Parties = lazy(() => import("./components/apps/warehouse/pages/parties/Parties.jsx"));
const Order = lazy(() => import("./components/apps/warehouse/pages/neworder/Order.jsx"));
const OrderData = lazy(() => import('./components/apps/warehouse/pages/neworder/orderDetails/OrderData.jsx'));
const ProductData = lazy(() => import('./components/apps/warehouse/pages/product/productDetails/ProductData.jsx'));
const ProductFiles = lazy(() => import('./components/apps/warehouse/pages/product/productFiles/ProductFiles.jsx'));
const ProductPage = lazy(() => import('./components/apps/warehouse/pages/product/ProductPage.jsx'));

import Login from './components/login/Login.jsx';
import RegForm from './components/regForm/RegForm.jsx';

import PrivateRoute from './components/apps/PrivateRoute.jsx';
import AuthStore from "./AuthStore.js";

import ProfilePage from './components/apps/profilePage/ProfilePage.jsx';
import SupplyTable from './components/supplyTable/SupplyTable.jsx';

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
          {
            path: "parties/:id",
            element: <SupplyTable />
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