import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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
      const response = await axios.post('http://localhost:3000/api/user/login', formData);
      if (response.data && response.data.success) {
        localStorage.setItem('accessToken', response.data.accessToken);
        window.location.href = '/';
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Thông tin đăng nhập không chính xác.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center pt-8 pb-24">
      <div className="w-full max-w-[440px] px-6">
        <div className="text-center mb-12 flex flex-col items-center">
          <img src="/Lumiere.png" alt="Lumière Logo" className="-mt-2 h-12 w-auto mb-8 object-contain" />
          <h2 className="font-heading text-4xl font-normal text-text-main mb-4 tracking-wide uppercase">Đăng nhập</h2>
          <p className="text-text-muted text-sm tracking-wider uppercase">Lumière Việt Nam</p>
        </div>
        
        {error && (
          <div className="bg-[#FAF9F8] border border-[#EAEAEA] text-error p-4 text-sm mb-8 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-widest text-text-muted font-medium">Email</label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-4 border border-[#EAEAEA] focus:outline-none focus:border-text-main transition-colors text-base rounded-none bg-transparent"
              placeholder="Nhập địa chỉ email"
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label className="text-xs uppercase tracking-widest text-text-muted font-medium">Mật khẩu</label>
              <Link to="/forgot-password" className="text-xs text-text-muted hover:text-text-main transition-colors underline underline-offset-4">Quên mật khẩu?</Link>
            </div>
            <input 
              type="password" 
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-4 border border-[#EAEAEA] focus:outline-none focus:border-text-main transition-colors text-base rounded-none bg-transparent"
              placeholder="Nhập mật khẩu"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-text-main text-white py-4 text-sm uppercase tracking-[0.2em] hover:bg-black transition-colors disabled:opacity-50 mt-4 rounded-none"
          >
            {loading ? 'Đang xử lý...' : 'Đăng Nhập'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-[#EAEAEA] text-center">
          <p className="text-sm text-text-muted mb-4">Bạn chưa có tài khoản?</p>
          <Link to="/register" className="inline-block w-full border border-text-main text-text-main py-4 text-sm uppercase tracking-[0.2em] hover:bg-background transition-colors text-center">
            Tạo tài khoản mới
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
