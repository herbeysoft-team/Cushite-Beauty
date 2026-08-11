export const ROUTES = {
  PUBLIC: {
    HOME: "/",
    SHOP: "/shop",
    PRODUCT: "/product/:id",
    CART: "/cart",
    CHECKOUT: "/checkout",
    LOGIN: "/login",
    REGISTER: "/register",
  },

  USER: {
    PROFILE: "/profile",
    ORDERS: "/orders",
    WISHLIST: "/wishlist",
  },

  ADMIN: {
    DASHBOARD: "/admin",
    PRODUCTS: "/admin/products",
    PRODUCT_NEW: "/admin/products/new",
    PRODUCT_EDIT: "/admin/products/:slug/edit",
    CATEGORIES: "/admin/categories",
    ORDERS: "/admin/orders",
    CUSTOMERS: "/admin/customers",
  },
};
