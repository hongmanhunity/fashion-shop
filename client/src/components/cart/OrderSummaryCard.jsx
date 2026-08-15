import { Link } from 'react-router-dom';

const OrderSummaryCard = ({ subtotal, formatVND, ordering, handleCheckout }) => {
  return (
    <div className="bg-surface p-8 rounded-2xl border border-border flex flex-col gap-6 h-fit sticky top-24">
      <h2 className="text-xl font-heading font-semibold pb-4 border-b border-border uppercase tracking-wider">
        Tóm tắt đơn hàng
      </h2>

      <div className="flex flex-col gap-4 text-sm">
        <div className="flex justify-between text-text-muted">
          <span>Tạm tính:</span>
          <span className="font-semibold text-text-main">{formatVND(subtotal)}</span>
        </div>
        <div className="flex justify-between text-text-muted">
          <span>Phí vận chuyển:</span>
          <span className="text-emerald-600 font-semibold">Miễn phí</span>
        </div>
        <div className="pt-4 border-t border-border flex justify-between items-center">
          <span className="text-base font-semibold uppercase tracking-wider">Tổng cộng:</span>
          <span className="text-2xl font-bold text-primary">{formatVND(subtotal)}</span>
        </div>
      </div>

      <button 
        disabled={ordering}
        onClick={handleCheckout}
        className="w-full bg-primary text-white py-4 rounded-full font-semibold uppercase tracking-widest text-sm transition-all hover:bg-primary-hover hover:shadow-soft hover:-translate-y-0.5 mt-2 disabled:opacity-50"
      >
        {ordering ? 'Đang xử lý...' : 'Tiến hành thanh toán'}
      </button>

      <Link 
        to="/products"
        className="text-center text-xs uppercase tracking-widest text-text-muted hover:text-primary transition-colors mt-2"
      >
        ← Tiếp tục mua sắm
      </Link>
    </div>
  );
};

export default OrderSummaryCard;
