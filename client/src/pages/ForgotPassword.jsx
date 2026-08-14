import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      const response = await axios.post('http://localhost:3000/api/user/forgotpassword', { email });
      if (response.data && response.data.success) {
        setMessage('Một liên kết khôi phục mật khẩu đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư đến.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể gửi yêu cầu. Vui lòng kiểm tra lại email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center pt-8 pb-24">
      <div className="w-full max-w-[440px] px-6">
        <div className="text-center mb-12 flex flex-col items-center">
          <img src="/Lumiere.png" alt="Lumière Logo" className="-mt-2 h-12 w-auto mb-8 object-contain" />
          <h2 className="font-heading text-4xl font-normal text-text-main mb-4 tracking-wide uppercase">Khôi phục mật khẩu</h2>
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
            <label className="text-xs uppercase tracking-widest text-text-muted font-medium">Email đã đăng ký</label>
            <input 
              type="email" 
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-4 border border-[#EAEAEA] focus:outline-none focus:border-text-main transition-colors text-base rounded-none bg-transparent"
              placeholder="Nhập địa chỉ email"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-text-main text-white py-4 text-sm uppercase tracking-[0.2em] hover:bg-black transition-colors disabled:opacity-50 mt-4 rounded-none"
          >
            {loading ? 'Đang gửi...' : 'Gửi Yêu Cầu'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-[#EAEAEA] text-center">
          <Link to="/login" className="text-sm text-text-muted hover:text-text-main transition-colors underline underline-offset-4 uppercase tracking-widest">
            Trở lại đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
