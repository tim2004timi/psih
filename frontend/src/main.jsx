import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
  Navigate  
} from "react-router-dom";
import { Provider } from 'react-redux';
import store  from './components/stm/store.js'
import Warehouse from "./components/apps/warehouse/Warehouse.jsx";
import Messager from "./components/apps/messager/Messager.jsx";
import Crm from "./components/apps/crm/Crm.jsx";
import Orders from "./components/apps/warehouse/pages/orders/Orders.jsx";
import Products from "./components/apps/warehouse/pages/products/Products.jsx";
import Remains from "./components/apps/warehouse/pages/remains/Remains.jsx";
import Parties from "./components/apps/warehouse/pages/parties/Parties.jsx";
import Order from "./components/apps/warehouse/pages/neworder/Order.jsx"
import Newproducts from './components/apps/warehouse/pages/newproducts/Newproducts.jsx';
import OrderData from './components/apps/warehouse/pages/neworder/orderDetails/OrderData.jsx';
import ProductsArchive from './components/apps/warehouse/pages/products/ProductsArchive.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: < Warehouse />,
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
            element: <OrderData />,
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
      },
      {
        path: "productsarchive",
        element: <ProductsArchive />,
      },
      {
        path: "newproducts",
        element: <Newproducts />,
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
    element: < Messager />,
  },
  {
    path: "/crm",
    element: < Crm />,
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>,
)