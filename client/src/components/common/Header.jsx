import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  ShoppingBag,
  User,
  MagnifyingGlass,
  SignOut,
} from "@phosphor-icons/react";

const Header = () => {
  const { user, isLoggedIn, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const userName = user ? `${user.firstname} ${user.lastname}` : "";

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Lỗi khi logout:", error);
    } finally {
      setShowDropdown(false);
      navigate("/login");
    }
  };

  return (
    <header className="bg-white/85 backdrop-blur-md sticky top-0 z-50 border-b border-border">
      {/* ĐÃ THAY ĐỔI: Bỏ container-custom, dùng w-full và px-8 lg:px-12 để tràn viền */}
      <div className="w-full px-6 lg:px-12 flex justify-between items-center h-20 relative">
        {/* Vùng 1: Logo (Tự động bám sát lề trái màn hình) */}
        <div className="font-heading text-3xl font-bold text-primary tracking-wide">
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/Lumiere.png"
              alt="Lumière Logo"
              className="h-8 object-contain"
            />
            <span className="hidden sm:block">Lumière</span>
          </Link>
        </div>

        {/* Vùng 2: Navigation (Luôn nằm ở chính giữa màn hình) */}
        <nav className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-8">
          <Link
            to="/"
            className="text-[15px] font-medium text-text-main uppercase tracking-wider transition-colors hover:text-primary"
          >
            Trang chủ
          </Link>
          <Link
            to="/products"
            className="text-[15px] font-medium text-text-main uppercase tracking-wider transition-colors hover:text-primary"
          >
            Sản phẩm
          </Link>
          <Link
            to="/about"
            className="text-[15px] font-medium text-text-main uppercase tracking-wider transition-colors hover:text-primary"
          >
            Về chúng tôi
          </Link>
        </nav>

        {/* Vùng 3: Icons & Actions (Tự động bám sát lề phải màn hình) */}
        <div className="flex gap-4 items-center">
          {/* Nút Tìm kiếm */}
          <button className="text-text-main hover:text-primary transition-colors flex items-center justify-center p-1">
            <MagnifyingGlass size={24} weight="regular" />
          </button>

          {/* Nút Giỏ hàng */}
          <Link to="/cart" className="text-text-main hover:text-primary transition-colors flex items-center justify-center relative p-1">
            <ShoppingBag size={24} weight="regular" />
          </Link>

          {/* Cụm User */}
          <div className="flex items-center gap-2 ">
            {isLoggedIn ? (
              <>
                {/* Vùng Icon User */}
                <div className="relative">
                  <button
                    className="text-text-main hover:text-primary transition-colors flex items-center justify-center p-1 focus:outline-none"
                    onClick={() => setShowDropdown(!showDropdown)}
                    onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                  >
                    <User size={24} weight="fill" className="text-primary" />
                  </button>

                  {/* Dropdown Menu */}
                  {showDropdown && (
                    <div className="absolute right-0 mt-4 w-48 bg-white border border-border rounded-xl shadow-float overflow-hidden z-50 animate-fade-in">
                      <div className="px-4 py-3 border-b border-border bg-accent/30">
                        <p className="text-sm font-semibold text-text-main truncate">
                          Tài khoản của tôi
                        </p>
                      </div>
                      <ul className="py-2">
                        <li>
                          <Link
                            to="/profile"
                            className="block px-4 py-2 text-sm text-text-muted hover:bg-background hover:text-primary transition-colors"
                          >
                            Thông tin cá nhân
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/orders"
                            className="block px-4 py-2 text-sm text-text-muted hover:bg-background hover:text-primary transition-colors"
                          >
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

                {/* Tên user */}
                {userName && (
                  <span className="text-sm font-medium text-text-main whitespace-nowrap hidden sm:block">
                    Xin chào, {userName}!
                  </span>
                )}
              </>
            ) : (
              <Link
                to="/login"
                className="text-text-main hover:text-primary transition-colors flex items-center justify-center p-1"
              >
                <User size={24} weight="regular" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
