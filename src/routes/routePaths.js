export const ROUTES = {
  PUBLIC: {
    HOME: "/",
    SHOP: "/shop",
    PRODUCT: "/product/:id",
    CART: "/cart",
    CHECKOUT: "/checkout",
    ORDER_CONFIRMATION: "/order-confirmation/:orderId",
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
    ORDER_DETAIL: "/admin/orders/:orderId",
    CUSTOMERS: "/admin/customers",
  },
};
