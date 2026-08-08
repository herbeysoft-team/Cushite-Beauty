import AppRouter from "./routes/AppRouter";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
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
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
