import { Routes, Route } from "react-router-dom";

import Layout from "../components/layout/Layout";

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

// Route Constants
import { ROUTES } from "./routePaths";

function AppRouter() {
  return (
   
    <Routes>
      {/* ==========================
          Public Routes
      =========================== */}
      <Route element={<Layout />}>
        <Route index element={<Home />} />

        <Route
          path={ROUTES.PUBLIC.SHOP}
          element={<Shop />}
        />

        <Route
          path={ROUTES.PUBLIC.PRODUCT}
          element={<Product />}
        />

        <Route
          path={ROUTES.PUBLIC.CART}
          element={<Cart />}
        />

        <Route
          path={ROUTES.PUBLIC.CHECKOUT}
          element={<Checkout />}
        />

        <Route
          path={ROUTES.PUBLIC.LOGIN}
          element={<Login />}
        />

        <Route
          path={ROUTES.PUBLIC.REGISTER}
          element={<Register />}
        />
      </Route>

      {/* ==========================
          Protected User Routes
      =========================== */}
      <Route element={<RequireAuth />}>
        <Route element={<Layout />}>
          <Route
            path={ROUTES.USER.PROFILE}
            element={<Profile />}
          />

          <Route
            path={ROUTES.USER.ORDERS}
            element={<Orders />}
          />

          <Route
            path={ROUTES.USER.WISHLIST}
            element={<Wishlist />}
          />
        </Route>
      </Route>

      {/* ==========================
          Admin Routes
      =========================== */}
      <Route element={<RequireAdmin />}>
        <Route element={<Layout />}>
          {/*
            We'll build these pages in Sprint 6.
          */}

          {/* Example */}
          {/* <Route
            path={ROUTES.ADMIN.DASHBOARD}
            element={<Dashboard />}
          /> */}

          {/* <Route
            path={ROUTES.ADMIN.PRODUCTS}
            element={<AdminProducts />}
          /> */}

          {/* <Route
            path={ROUTES.ADMIN.ORDERS}
            element={<AdminOrders />}
          /> */}

          {/* <Route
            path={ROUTES.ADMIN.CUSTOMERS}
            element={<Customers />}
          /> */}
        </Route>
      </Route>

      {/* ==========================
          404 Page
      =========================== */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRouter;