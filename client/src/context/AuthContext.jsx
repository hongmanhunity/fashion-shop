import { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance, { setAccessToken, getAccessToken } from '../api/axiosInstance';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Khởi tạo user từ localStorage giúp giao diện giữ trạng thái đăng nhập tức thì khi F5
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [isInitializing, setIsInitializing] = useState(true);

  // Tự động kiểm tra & đồng bộ trạng thái đăng nhập khi F5 hoặc mở lại ứng dụng
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = getAccessToken();
        
        // 1. Nếu đã có AccessToken trong localStorage -> Kiểm tra thẳng thông tin User hiện tại
        if (token) {
          try {
            const profileRes = await axiosInstance.get('/user/current');
            if (profileRes.data?.success) {
              setUser(profileRes.data.user);
              localStorage.setItem('user', JSON.stringify(profileRes.data.user));
              return; // Xác thực thành công!
            }
          } catch (profileErr) {
            console.log('AccessToken hết hạn, đang tự động làm mới...');
          }
        }

        // 2. Nếu không có AccessToken hoặc Token đã hết hạn -> Thử Refresh Token qua Cookie
        const refreshRes = await axiosInstance.post('/user/refresh-token');
        if (refreshRes.data?.success && refreshRes.data?.accessToken) {
          setAccessToken(refreshRes.data.accessToken);

          // Lấy thông tin người dùng mới sau khi cấp lại AccessToken
          const profileRes = await axiosInstance.get('/user/current');
          if (profileRes.data?.success) {
            setUser(profileRes.data.user);
            localStorage.setItem('user', JSON.stringify(profileRes.data.user));
          }
        }
      } catch (err) {
        // Hết hạn cả Refresh Token -> Đăng xuất an toàn
        setAccessToken(null);
        setUser(null);
        localStorage.removeItem('user');
      } finally {
        setIsInitializing(false);
      }
    };

    initAuth();
  }, []);

  const login = (userData, accessToken) => {
    setAccessToken(accessToken);
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = async () => {
    try {
      await axiosInstance.post('/user/logout');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setAccessToken(null);
      setUser(null);
      localStorage.removeItem('user');
    }
  };

  const updateUser = (updatedData) => {
    setUser((prev) => {
      const newUser = { ...prev, ...updatedData };
      localStorage.setItem('user', JSON.stringify(newUser));
      return newUser;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isInitializing,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
