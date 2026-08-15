import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';

/**
 * 💡 CUSTOM HOOK: useProfile
 * -------------------------------------------------------------
 * Mục đích: Tách toàn bộ Logic xử lý thông tin cá nhân (State, Fetch API, Update API)
 * ra khỏi giao diện UI (Profile.jsx).
 * Giúp code giao diện ngắn gọn, dễ đọc và tập trung vào hiển thị.
 */
export const useProfile = () => {
  const { updateUser } = useAuth();
  
  // 1. Quản lý trạng thái thông tin form
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    mobile: '',
    address: '',
    avatar: '',
  });

  // 2. Trạng thái tải trang & thông báo
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  // 3. Tự động lấy thông tin User hiện tại từ Backend khi vừa mở trang
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Gửi GET request tới API /user/current (đã tự động đính kèm Access Token trong axiosInstance)
        const response = await axiosInstance.get('/user/current');

        if (response.data && response.data.success) {
          const user = response.data.user;
          // Điền thông tin lấy từ Backend vào Form
          setFormData({
            firstname: user.firstname || '',
            lastname: user.lastname || '',
            email: user.email || '',
            mobile: user.mobile || '',
            address: user.address || '',
            avatar: user.avatar || '',
          });
        }
      } catch (error) {
        console.error('Lỗi khi tải thông tin người dùng:', error);
        setMessage({
          type: 'error',
          text: 'Không thể tải thông tin cá nhân. Vui lòng đăng nhập lại.',
        });
        // Nếu lỗi 401 (Chưa đăng nhập) -> Chuyển hướng sang trang Đăng nhập
        if (error.response?.status === 401 || error.response?.status === 403) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  // 4. Hàm lắng nghe thay đổi ô nhập dữ liệu text (Firstname, Lastname, Mobile, Address)
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 5. Hàm cập nhật chuỗi Base64 ảnh đại diện mới khi chọn ảnh
  const handleAvatarChange = (newAvatarBase64) => {
    setFormData((prev) => ({ ...prev, avatar: newAvatarBase64 }));
  };

  // 6. Hàm bấm nút "Lưu thay đổi" -> Gửi dữ liệu cập nhật về Backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await axiosInstance.put('/user/current', formData);

      if (response.data && response.data.success) {
        setMessage({
          type: 'success',
          text: 'Cập nhật thông tin cá nhân và ảnh đại diện thành công!',
        });

        // Đồng bộ thông tin user mới cập nhật vào AuthContext toàn ứng dụng
        const updatedUser = response.data.updateUser;
        if (updatedUser) {
          updateUser(updatedUser);
        }
      }
    } catch (error) {
      console.error('Lỗi cập nhật profile:', error);
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật thông tin.',
      });
    } finally {
      setUpdating(false);
    }
  };

  // 7. Trả về các dữ liệu & hàm xử lý để giao diện (Profile.jsx) chỉ việc lấy ra dùng
  return {
    formData,
    loading,
    updating,
    message,
    handleChange,
    handleAvatarChange,
    handleSubmit,
  };
};
