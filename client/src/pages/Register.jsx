import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    mobile: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await axiosInstance.post('/user/register', formData);
      if (response.data && response.data.success) {
        navigate('/login');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng ký thất bại. Vui lòng kiểm tra thông tin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center pt-8 pb-24">
      <div className="w-full max-w-[480px] px-6">
        <div className="text-center mb-12 flex flex-col items-center">
          <img src="/Lumiere.png" alt="Lumière Logo" className="-mt-2 h-12 w-auto mb-8 object-contain" />
          <h2 className="font-heading text-4xl font-normal text-text-main mb-4 tracking-wide uppercase">Tạo tài khoản</h2>
          <p className="text-text-muted text-sm tracking-wider uppercase">Lumière Việt Nam</p>
        </div>
        
        {error && (
          <div className="bg-[#FAF9F8] border border-[#EAEAEA] text-error p-4 text-sm mb-8 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex gap-4">
            <div className="flex flex-col gap-2 flex-1">
              <label className="text-xs uppercase tracking-widest text-text-muted font-medium">Họ</label>
              <input 
                type="text" 
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
                required
                className="w-full p-4 border border-[#EAEAEA] focus:outline-none focus:border-text-main transition-colors text-base rounded-none bg-transparent"
              />
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <label className="text-xs uppercase tracking-widest text-text-muted font-medium">Tên</label>
              <input 
                type="text" 
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
                required
                className="w-full p-4 border border-[#EAEAEA] focus:outline-none focus:border-text-main transition-colors text-base rounded-none bg-transparent"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-widest text-text-muted font-medium">Email</label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-4 border border-[#EAEAEA] focus:outline-none focus:border-text-main transition-colors text-base rounded-none bg-transparent"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-widest text-text-muted font-medium">Số điện thoại</label>
            <input 
              type="tel" 
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              required
              className="w-full p-4 border border-[#EAEAEA] focus:outline-none focus:border-text-main transition-colors text-base rounded-none bg-transparent"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-widest text-text-muted font-medium">Mật khẩu</label>
            <input 
              type="password" 
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-4 border border-[#EAEAEA] focus:outline-none focus:border-text-main transition-colors text-base rounded-none bg-transparent"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-text-main text-white py-4 text-sm uppercase tracking-[0.2em] hover:bg-black transition-colors disabled:opacity-50 mt-4 rounded-none"
          >
            {loading ? 'Đang xử lý...' : 'Tạo Tài Khoản'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-[#EAEAEA] text-center">
          <p className="text-sm text-text-muted mb-4">Bạn đã có tài khoản?</p>
          <Link to="/login" className="inline-block w-full border border-text-main text-text-main py-4 text-sm uppercase tracking-[0.2em] hover:bg-background transition-colors text-center">
            Đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
