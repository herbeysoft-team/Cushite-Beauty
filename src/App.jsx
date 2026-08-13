import AppRouter from "./routes/AppRouter";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import Loader from "./components/common/Loader";

function AppContent() {
  const { loading } = useAuth();

  if (loading) return <Loader fullScreen label="Loading..." />;

  return <AppRouter />;
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <AppContent />
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
