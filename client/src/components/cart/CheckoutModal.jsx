import { useState } from 'react';
import { X, CreditCard, Bank, Money, Check, Copy } from '@phosphor-icons/react';

const CheckoutModal = ({ isOpen, onClose, total, formatVND, onConfirmCheckout, ordering }) => {
  const [paymentMethod, setPaymentMethod] = useState('BANK_TRANSFER');
  const [address, setAddress] = useState('123 Đường Nguyễn Trãi, Quận 1, TP. Hồ Chí Minh');
  const [copied, setCopied] = useState(false);

  // Credit Card Form State
  const [cardInfo, setCardInfo] = useState({
    number: '4532 8910 1112 3456',
    name: 'NGUYEN VAN A',
    expiry: '12/28',
    cvv: '888',
  });

  if (!isOpen) return null;

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onConfirmCheckout({
      address,
      paymentMethod,
      cardNumber: cardInfo.number,
      bankName: 'MB Bank - VietQR',
    });
  };

  const transferContent = `LUMIERE_${Math.floor(1000 + Math.random() * 9000)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-border flex flex-col gap-6 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-border">
          <h2 className="text-2xl font-heading font-bold uppercase tracking-wider text-text-main">
            Thanh Toán Đơn Hàng
          </h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-surface text-text-muted hover:text-text-main transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Total Price Banner */}
        <div className="bg-surface p-4 rounded-2xl flex justify-between items-center border border-border">
          <span className="text-sm font-semibold text-text-muted uppercase tracking-wider">Tổng thanh toán:</span>
          <span className="text-2xl font-bold text-primary">{formatVND(total)}</span>
        </div>

        {/* Address Input */}
        <div className="flex flex-col gap-2">
          <label className="text-xs uppercase tracking-widest font-semibold text-text-muted">
            Địa chỉ nhận hàng
          </label>
          <input 
            type="text" 
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-1 focus:ring-primary text-sm outline-none"
            placeholder="Nhập địa chỉ giao hàng của bạn..."
            required
          />
        </div>

        {/* Payment Methods Selector */}
        <div className="flex flex-col gap-3">
          <label className="text-xs uppercase tracking-widest font-semibold text-text-muted">
            Chọn phương thức thanh toán
          </label>

          <div className="grid grid-cols-3 gap-3">
            {/* VietQR Bank */}
            <button
              type="button"
              onClick={() => setPaymentMethod('BANK_TRANSFER')}
              className={`p-3.5 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
                paymentMethod === 'BANK_TRANSFER'
                  ? 'border-primary bg-primary/5 ring-2 ring-primary/20 text-primary font-semibold'
                  : 'border-border text-text-muted hover:border-text-muted'
              }`}
            >
              <Bank size={28} />
              <span className="text-xs text-center">VietQR / CK</span>
            </button>

            {/* Credit Card */}
            <button
              type="button"
              onClick={() => setPaymentMethod('CREDIT_CARD')}
              className={`p-3.5 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
                paymentMethod === 'CREDIT_CARD'
                  ? 'border-primary bg-primary/5 ring-2 ring-primary/20 text-primary font-semibold'
                  : 'border-border text-text-muted hover:border-text-muted'
              }`}
            >
              <CreditCard size={28} />
              <span className="text-xs text-center">Thẻ Quốc Tế</span>
            </button>

            {/* COD */}
            <button
              type="button"
              onClick={() => setPaymentMethod('COD')}
              className={`p-3.5 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
                paymentMethod === 'COD'
                  ? 'border-primary bg-primary/5 ring-2 ring-primary/20 text-primary font-semibold'
                  : 'border-border text-text-muted hover:border-text-muted'
              }`}
            >
              <Money size={28} />
              <span className="text-xs text-center">Tiền mặt COD</span>
            </button>
          </div>
        </div>

        {/* Dynamic Payment Method Content */}
        {paymentMethod === 'BANK_TRANSFER' && (
          <div className="bg-surface p-5 rounded-2xl border border-border flex flex-col sm:flex-row items-center gap-6">
            {/* VietQR Image */}
            <div className="w-36 h-36 bg-white p-2 rounded-xl border border-border flex-shrink-0 shadow-sm">
              <img 
                src={`https://img.vietqr.io/image/MB-0338361819-compact2.png?amount=${total}&addInfo=${transferContent}`} 
                alt="VietQR Payment"
                className="w-full h-full object-contain rounded-lg" 
              />
            </div>
            
            <div className="flex flex-col gap-2 text-xs text-text-muted w-full">
              <div className="flex justify-between items-center">
                <span>Ngân hàng:</span>
                <span className="font-bold text-text-main">MB Bank (Quân Đội)</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Số tài khoản:</span>
                <div className="flex items-center gap-1 font-mono font-bold text-text-main">
                  <span>0338361819</span>
                  <button onClick={() => handleCopy('0338361819')} className="text-primary hover:text-primary-hover p-1">
                    {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span>Chủ tài khoản:</span>
                <span className="font-bold text-text-main">LUMIERE FASHION</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Nội dung CK:</span>
                <span className="font-mono font-bold text-primary">{transferContent}</span>
              </div>
            </div>
          </div>
        )}

        {paymentMethod === 'CREDIT_CARD' && (
          <div className="flex flex-col gap-4 bg-surface p-5 rounded-2xl border border-border">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] uppercase tracking-wider font-semibold text-text-muted">Số thẻ (Card Number)</label>
              <input 
                type="text" 
                value={cardInfo.number}
                onChange={(e) => setCardInfo({ ...cardInfo, number: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-border text-sm font-mono focus:border-primary outline-none"
                placeholder="4532 8910 1112 3456"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] uppercase tracking-wider font-semibold text-text-muted">Hạn thẻ (MM/YY)</label>
                <input 
                  type="text" 
                  value={cardInfo.expiry}
                  onChange={(e) => setCardInfo({ ...cardInfo, expiry: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-border text-sm font-mono focus:border-primary outline-none"
                  placeholder="12/28"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[11px] uppercase tracking-wider font-semibold text-text-muted">Mã CVV</label>
                <input 
                  type="password" 
                  value={cardInfo.cvv}
                  onChange={(e) => setCardInfo({ ...cardInfo, cvv: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-border text-sm font-mono focus:border-primary outline-none"
                  placeholder="888"
                />
              </div>
            </div>
          </div>
        )}

        {paymentMethod === 'COD' && (
          <div className="bg-surface p-4 rounded-2xl border border-border text-xs text-text-muted text-center leading-relaxed">
            📦 Bạn sẽ thanh toán trực tiếp bằng tiền mặt cho nhân viên giao hàng khi nhận được gói hàng.
          </div>
        )}

        {/* Submit Button */}
        <button
          type="button"
          onClick={handleFormSubmit}
          disabled={ordering}
          className="w-full bg-primary text-white py-4 rounded-full font-semibold uppercase tracking-widest text-sm transition-all hover:bg-primary-hover hover:shadow-soft disabled:opacity-50 mt-2"
        >
          {ordering ? 'Đang khởi tạo đơn hàng...' : `Xác Nhận & Thanh Toán (${formatVND(total)})`}
        </button>
      </div>
    </div>
  );
};

export default CheckoutModal;
