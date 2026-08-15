import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { ShoppingBag } from '@phosphor-icons/react';
import CartItemRow from '../components/cart/CartItemRow';
import OrderSummaryCard from '../components/cart/OrderSummaryCard';
import CheckoutModal from '../components/cart/CheckoutModal';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [ordering, setOrdering] = useState(false);

  const fetchCart = useCallback(async (isInitial = false) => {
    try {
      if (isInitial) setLoading(true);
      const response = await axiosInstance.get('/user/cart');
      if (response.data && response.data.success) {
        setCartItems(response.data.cart || []);
      }
    } catch (err) {
      console.error('Error fetching cart:', err);
    } finally {
      if (isInitial) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart(true);
  }, [fetchCart]);

  const handleUpdateQuantity = async (pid, newQuantity, maxStock) => {
    if (newQuantity < 1 || newQuantity > maxStock) return;
    
    // Lưu lại trạng thái cũ phòng trường hợp API bị lỗi để Rollback
    const previousItems = [...cartItems];

    // 1. Optimistic Update: Cập nhật giao diện ngay lập tức trong 0ms (Không giật nháy)
    setCartItems(prev => prev.map(item => {
      if (item.product?._id === pid) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));

    setUpdatingId(pid);
    setErrorMsg('');
    try {
      const diff = newQuantity - (previousItems.find(item => item.product._id === pid)?.quantity || 0);
      const response = await axiosInstance.put('/user/cart', {
        pid,
        quantity: diff
      });
      if (!response.data?.success) {
        setCartItems(previousItems); // Rollback nếu backend không báo success
      }
    } catch (err) {
      setCartItems(previousItems); // Rollback nếu gặp lỗi mạng/API
      setErrorMsg(err.response?.data?.message || 'Không thể cập nhật số lượng!');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRemoveItem = async (pid) => {
    setUpdatingId(pid);
    setErrorMsg('');
    try {
      const response = await axiosInstance.delete(`/user/cart/${pid}`);
      if (response.data && response.data.success) {
        setCartItems(response.data.cart || []);
      }
    } catch (err) {
      setErrorMsg('Không thể xóa sản phẩm khỏi giỏ hàng!');
    } finally {
      setUpdatingId(null);
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);

  const handleConfirmCheckout = async (paymentPayload) => {
    setOrdering(true);
    setErrorMsg('');
    try {
      const response = await axiosInstance.post('/order', paymentPayload);
      if (response.data && response.data.success) {
        setCreatedOrder(response.data.order);
        setCheckoutSuccess(true);
        setIsModalOpen(false);
        setCartItems([]);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Không thể tạo đơn hàng!');
    } finally {
      setOrdering(false);
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => {
      const price = item.product?.price || item.price || 0;
      return sum + price * item.quantity;
    }, 0);
  };

  const formatVND = (num) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
  };

  if (loading) {
    return (
      <div className="container-custom py-16 text-center text-text-muted">
        Đang tải giỏ hàng...
      </div>
    );
  }

  if (checkoutSuccess) {
    const paymentInfo = createdOrder?.paymentInfo;
    const methodNames = {
      BANK_TRANSFER: 'Chuyển khoản VietQR',
      CREDIT_CARD: 'Thẻ Quốc Tế (Visa/Mastercard)',
      COD: 'Thanh toán khi nhận hàng (COD)',
    };

    return (
      <div className="container-custom py-16 flex flex-col items-center justify-center gap-6 text-center">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-4xl font-bold shadow-soft">
          ✓
        </div>
        <h2 className="text-3xl font-heading font-bold text-text-main">Đặt Hàng & Thanh Toán Thành Công!</h2>
        <p className="text-text-muted max-w-md">
          Cảm ơn bạn đã mua sắm tại Lumière! Đơn hàng của bạn đã được ghi nhận vào hệ thống.
        </p>

        {/* Order Details Receipt */}
        <div className="bg-surface p-6 rounded-2xl border border-border w-full max-w-md flex flex-col gap-3 text-sm text-left shadow-sm">
          <div className="flex justify-between">
            <span className="text-text-muted">Mã giao dịch:</span>
            <span className="font-mono font-bold text-primary">{paymentInfo?.transactionId || createdOrder?._id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">Phương thức:</span>
            <span className="font-semibold text-text-main">{methodNames[createdOrder?.paymentMethod] || 'COD'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">Trạng thái thanh toán:</span>
            <span className={`font-semibold ${createdOrder?.paymentStatus === 'Paid' ? 'text-emerald-600' : 'text-amber-600'}`}>
              {createdOrder?.paymentStatus === 'Paid' ? '✓ Đã thanh toán' : 'Chờ thanh toán'}
            </span>
          </div>
          <div className="flex justify-between pt-2 border-t border-border">
            <span className="font-semibold text-text-main">Tổng số tiền:</span>
            <span className="font-bold text-lg text-primary">{formatVND(createdOrder?.total || 0)}</span>
          </div>
        </div>

        <Link 
          to="/products"
          className="mt-4 bg-primary text-white px-8 py-3.5 rounded-full font-semibold uppercase tracking-wider text-sm transition-all hover:bg-primary-hover hover:shadow-soft"
        >
          Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="container-custom py-20 flex flex-col items-center justify-center gap-6">
        <ShoppingBag size={80} className="text-text-muted stroke-[1.5]" />
        <h2 className="text-2xl font-heading font-semibold">Giỏ hàng của bạn đang trống</h2>
        <p className="text-text-muted max-w-md text-center">
          Hãy khám phá bộ sưu tập thời trang cao cấp của Lumière và chọn cho mình những trang phục yêu thích nhất.
        </p>
        <Link 
          to="/products"
          className="mt-2 bg-primary text-white px-8 py-3.5 rounded-full font-semibold uppercase tracking-wider text-sm transition-all hover:bg-primary-hover hover:shadow-soft"
        >
          Khám phá sản phẩm
        </Link>
      </div>
    );
  }

  const subtotal = calculateSubtotal();

  return (
    <div className="container-custom py-12">
      <h1 className="text-3xl font-heading uppercase tracking-wider mb-8">Giỏ hàng của bạn</h1>

      {errorMsg && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12">
        {/* Cart List */}
        <div className="flex flex-col gap-6">
          <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_40px] gap-4 pb-4 border-b border-border text-xs uppercase tracking-widest text-text-muted font-semibold">
            <span>Sản phẩm</span>
            <span className="text-center">Đơn giá</span>
            <span className="text-center">Số lượng</span>
            <span className="text-right">Thành tiền</span>
            <span></span>
          </div>

          {cartItems.map((item) => (
            <CartItemRow
              key={item.product?._id || item._id}
              item={item}
              updatingId={updatingId}
              handleUpdateQuantity={handleUpdateQuantity}
              handleRemoveItem={handleRemoveItem}
              formatVND={formatVND}
            />
          ))}
        </div>

        {/* Order Summary Sidebar */}
        <OrderSummaryCard
          subtotal={subtotal}
          formatVND={formatVND}
          ordering={ordering}
          handleCheckout={() => setIsModalOpen(true)}
        />
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        total={subtotal}
        formatVND={formatVND}
        onConfirmCheckout={handleConfirmCheckout}
        ordering={ordering}
      />
    </div>
  );
};

export default Cart;
