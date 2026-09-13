import { Link } from "react-router-dom";
import { AtSign, MessageCircle, Mail } from "lucide-react";
import logo from "../../assets/logo-white.png";

function Footer() {
  return (
    <footer className="mt-20" style={{ background: "linear-gradient(135deg,#4A136C 0%, #381055 100%)" }}>
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-2 gap-12 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <img src={logo} alt="Cushite Beauty" className="h-14 sm:h-16" />
            <p className="mt-2 text-sm text-white/60">
              Premium skincare, makeup and fragrances — Edinburgh, the UK and Africa.
            </p>
            <div className="mt-4 flex gap-3 text-white/70">
              <a href="#" aria-label="Instagram" className="hover:text-white">
                <AtSign size={18} />
              </a>
              <a href="#" aria-label="Messenger" className="hover:text-white">
                <MessageCircle size={18} />
              </a>
              <a href="mailto:hello@cushitebeauty.com" aria-label="Email" className="hover:text-white">
                <Mail size={18} />
              </a>
            </div>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold text-white">Shop</p>
            <ul className="flex flex-col gap-2 text-sm text-white/60">
              <li><Link to="/shop" className="hover:text-white">All Products</Link></li>
              <li><Link to="/wishlist" className="hover:text-white">Wishlist</Link></li>
              <li><Link to="/cart" className="hover:text-white">Cart</Link></li>
            </ul>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold text-white">Company</p>
            <ul className="flex flex-col gap-2 text-sm text-white/60">
              <li><Link to="/about" className="hover:text-white">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-white">Contact Us</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-white">Privacy Policy</Link></li>
            </ul>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold text-white">Account</p>
            <ul className="flex flex-col gap-2 text-sm text-white/60">
              <li><Link to="/login" className="hover:text-white">Login</Link></li>
              <li><Link to="/orders" className="hover:text-white">Order History</Link></li>
              <li><Link to="/profile" className="hover:text-white">My Profile</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-white/50">
          © {new Date().getFullYear()} Cushite Beauty. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
