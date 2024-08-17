import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
  Navigate  
} from "react-router-dom";
import Warehouse from "./components/apps/warehouse/Warehouse.jsx";
import Messager from "./components/apps/messager/Messager.jsx";
import Crm from "./components/apps/crm/Crm.jsx";
import Orders from "./components/apps/warehouse/pages/orders/Orders.jsx";
import Products from "./components/apps/warehouse/pages/products/Products.jsx";
import Remains from "./components/apps/warehouse/pages/remains/Remains.jsx";
import Parties from "./components/apps/warehouse/pages/parties/Parties.jsx";
import NewOrder from "./components/apps/warehouse/pages/neworder/NewOrder.jsx"
import Newproducts from './components/apps/warehouse/pages/newproducts/Newproducts.jsx';
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
        path: "neworder",
        element: <NewOrder />,
      },
      {
        path: "products",
        element: <Products />,
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
    <RouterProvider router={router} />
  </React.StrictMode>,
)
