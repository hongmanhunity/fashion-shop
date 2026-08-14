import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      const response = await axios.put(`http://localhost:3000/api/user/reset-password/${token}`, { password });
      if (response.data && response.data.success) {
        setMessage('Đặt lại mật khẩu thành công! Bạn sẽ được chuyển hướng về trang đăng nhập...');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Link khôi phục đã hết hạn hoặc không hợp lệ.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center pt-16 pb-24">
      <div className="w-full max-w-[440px] px-6">
        <div className="text-center mb-12">
          <h2 className="font-heading text-4xl font-normal text-text-main mb-4 tracking-wide uppercase">Mật khẩu mới</h2>
          <p className="text-text-muted text-sm tracking-wider uppercase">Lumière Việt Nam</p>
        </div>
        
        {error && (
          <div className="bg-[#FAF9F8] border border-[#EAEAEA] text-error p-4 text-sm mb-8 text-center">
            {error}
          </div>
        )}
        
        {message && (
          <div className="bg-[#FAF9F8] border border-success/30 text-success p-4 text-sm mb-8 text-center">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-widest text-text-muted font-medium">Mật khẩu mới</label>
            <input 
              type="password" 
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-4 border border-[#EAEAEA] focus:outline-none focus:border-text-main transition-colors text-base rounded-none bg-transparent"
              placeholder="Nhập mật khẩu mới của bạn"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading || message !== ''}
            className="w-full bg-text-main text-white py-4 text-sm uppercase tracking-[0.2em] hover:bg-black transition-colors disabled:opacity-50 mt-4 rounded-none"
          >
            {loading ? 'Đang xử lý...' : 'Xác nhận'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
