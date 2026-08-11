import { Routes, Route } from "react-router-dom";

import Layout from "../components/layout/Layout";
import AdminLayout from "../components/layout/AdminLayout";

import RequireAuth from "../guards/RequireAuth";
import RequireAdmin from "../guards/RequireAdmin";

import Home from "../pages/Home";
import Shop from "../pages/Shop";
import Product from "../pages/Product";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Profile from "../pages/Profile";
import Orders from "../pages/Orders";
import Wishlist from "../pages/Wishlist";
import NotFound from "../pages/NotFound";

import AdminDashboard from "../pages/Admin/Dashboard";
import AdminProducts from "../pages/Admin/Products";
import AdminProductForm from "../pages/Admin/Products/AdminProductForm";
import AdminCategories from "../pages/Admin/Categories";
import AdminCustomers from "../pages/Admin/Customers";

import { ROUTES } from "./routePaths";

function AppRouter() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path={ROUTES.PUBLIC.SHOP} element={<Shop />} />
        <Route path={ROUTES.PUBLIC.PRODUCT} element={<Product />} />
        <Route path={ROUTES.PUBLIC.CART} element={<Cart />} />
        <Route path={ROUTES.PUBLIC.CHECKOUT} element={<Checkout />} />
        <Route path={ROUTES.PUBLIC.LOGIN} element={<Login />} />
        <Route path={ROUTES.PUBLIC.REGISTER} element={<Register />} />
      </Route>

      <Route element={<RequireAuth />}>
        <Route element={<Layout />}>
          <Route path={ROUTES.USER.PROFILE} element={<Profile />} />
          <Route path={ROUTES.USER.ORDERS} element={<Orders />} />
          <Route path={ROUTES.USER.WISHLIST} element={<Wishlist />} />
        </Route>
      </Route>

      <Route element={<RequireAdmin />}>
        <Route element={<AdminLayout />}>
          <Route path={ROUTES.ADMIN.DASHBOARD} element={<AdminDashboard />} />
          <Route path={ROUTES.ADMIN.PRODUCTS} element={<AdminProducts />} />
          <Route path={ROUTES.ADMIN.PRODUCT_NEW} element={<AdminProductForm />} />
          <Route path={ROUTES.ADMIN.PRODUCT_EDIT} element={<AdminProductForm />} />
          <Route path={ROUTES.ADMIN.CATEGORIES} element={<AdminCategories />} />
          <Route path={ROUTES.ADMIN.CUSTOMERS} element={<AdminCustomers />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRouter;
