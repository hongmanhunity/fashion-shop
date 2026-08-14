import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, MagnifyingGlass, SignOut } from '@phosphor-icons/react';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    setIsLoggedIn(false);
    setShowDropdown(false);
    navigate('/login');
  };

  return (
    <header className="bg-white/85 backdrop-blur-md sticky top-0 z-50 border-b border-border">
      <div className="container-custom grid grid-cols-3 items-center h-20">
        <div className="font-heading text-3xl font-bold text-primary tracking-wide flex justify-start">
          <Link to="/" className="flex items-center gap-2">
            <img src="/Lumiere.png" alt="Lumière Logo" className="h-8 object-contain" />
            Lumière
          </Link>
        </div>
        
        <nav className="flex gap-8 justify-center">
          <Link to="/" className="text-[15px] font-medium text-text-main uppercase tracking-wider transition-colors hover:text-primary">Trang chủ</Link>
          <Link to="/products" className="text-[15px] font-medium text-text-main uppercase tracking-wider transition-colors hover:text-primary">Sản phẩm</Link>
          <Link to="/about" className="text-[15px] font-medium text-text-main uppercase tracking-wider transition-colors hover:text-primary">Về chúng tôi</Link>
        </nav>
        
        <div className="flex gap-6 items-center justify-end">
          <button className="text-text-main hover:text-primary transition-colors flex items-center justify-center relative">
            <MagnifyingGlass size={24} weight="regular" />
          </button>
          
          {/* User Icon with Dropdown */}
          <div className="relative">
            {isLoggedIn ? (
              <button 
                className="text-text-main hover:text-primary transition-colors flex items-center justify-center relative focus:outline-none"
                onClick={() => setShowDropdown(!showDropdown)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
              >
                <User size={24} weight="fill" className="text-primary" />
              </button>
            ) : (
              <Link to="/login" className="text-text-main hover:text-primary transition-colors flex items-center justify-center relative">
                <User size={24} weight="regular" />
              </Link>
            )}

            {/* Dropdown Menu */}
            {isLoggedIn && showDropdown && (
              <div className="absolute right-0 mt-4 w-48 bg-white border border-border rounded-xl shadow-float overflow-hidden z-50 animate-fade-in">
                <div className="px-4 py-3 border-b border-border bg-accent/30">
                  <p className="text-sm font-semibold text-text-main">Tài khoản của tôi</p>
                </div>
                <ul className="py-2">
                  <li>
                    <Link to="/profile" className="block px-4 py-2 text-sm text-text-muted hover:bg-background hover:text-primary transition-colors">
                      Thông tin cá nhân
                    </Link>
                  </li>
                  <li>
                    <Link to="/orders" className="block px-4 py-2 text-sm text-text-muted hover:bg-background hover:text-primary transition-colors">
                      Đơn hàng
                    </Link>
                  </li>
                  <li className="border-t border-border mt-2 pt-2">
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-error hover:bg-error/5 transition-colors flex items-center gap-2"
                    >
                      <SignOut size={16} /> Đăng xuất
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>

          <button className="text-text-main hover:text-primary transition-colors flex items-center justify-center relative">
            <ShoppingBag size={24} weight="regular" />
            <span className="absolute -top-1 -right-1.5 bg-primary text-white text-[10px] font-bold h-4 min-w-[16px] rounded-full flex items-center justify-center px-1">
              2
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
