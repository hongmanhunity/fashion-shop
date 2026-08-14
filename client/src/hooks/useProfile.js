import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const useProfile = () => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    mobile: '',
    address: '',
    avatar: '',
  });

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get('http://localhost:3000/api/user/current', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data && response.data.success) {
          const user = response.data.user;
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
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (newAvatarBase64) => {
    setFormData((prev) => ({ ...prev, avatar: newAvatarBase64 }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setMessage({ type: '', text: '' });

    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await axios.put(
        'http://localhost:3000/api/user/current',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data && response.data.success) {
        setMessage({
          type: 'success',
          text: 'Cập nhật thông tin cá nhân và ảnh đại diện thành công!',
        });

        const updatedUser = response.data.updateUser;
        if (updatedUser) {
          localStorage.setItem('userData', JSON.stringify(updatedUser));
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
