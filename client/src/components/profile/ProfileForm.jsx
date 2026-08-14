import { User, EnvelopeSimple, Phone, MapPin, FloppyDisk, LockKey } from '@phosphor-icons/react';

const ProfileForm = ({ formData, onChange, onSubmit, updating }) => {
  return (
    <div className="bg-white/85 backdrop-blur-xl p-8 sm:p-10 rounded-3xl border border-white/60 shadow-float">
      <h2 className="text-xl font-heading font-medium text-text-main mb-6 border-b border-border pb-4 flex items-center justify-between">
        <span>Thông Tin Cá Nhân & Giao Hàng</span>
        <span className="text-xs font-normal text-text-muted font-sans">Vui lòng kiểm tra chính xác địa chỉ</span>
      </h2>

      <form onSubmit={onSubmit} className="flex flex-col gap-6">
        {/* Họ và Tên */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="text-xs uppercase tracking-wider text-text-muted font-medium mb-2 flex items-center gap-1.5">
              <User size={16} className="text-primary" /> Tên
            </label>
            <input
              type="text"
              name="firstname"
              value={formData.firstname}
              onChange={onChange}
              required
              className="w-full p-4 border border-border/80 rounded-2xl focus:outline-none focus:border-primary transition-colors text-sm bg-white font-normal"
              placeholder="Nhập tên"
            />
          </div>

          <div>
            <label className="text-xs uppercase tracking-wider text-text-muted font-medium mb-2 flex items-center gap-1.5">
              <User size={16} className="text-primary" /> Họ
            </label>
            <input
              type="text"
              name="lastname"
              value={formData.lastname}
              onChange={onChange}
              required
              className="w-full p-4 border border-border/80 rounded-2xl focus:outline-none focus:border-primary transition-colors text-sm bg-white font-normal"
              placeholder="Nhập họ"
            />
          </div>
        </div>

        {/* Email (Khóa cố định không cho sửa) & Số điện thoại */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="text-xs uppercase tracking-wider text-text-muted font-medium mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <EnvelopeSimple size={16} className="text-primary" /> Email Đăng Nhập
              </span>
              <span className="text-[11px] text-text-muted bg-accent/80 px-2 py-0.5 rounded border border-border flex items-center gap-1">
                <LockKey size={12} /> Cố định
              </span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              disabled
              readOnly
              className="w-full p-4 border border-border/60 rounded-2xl text-sm bg-accent/40 text-text-muted cursor-not-allowed font-normal"
              title="Email đăng nhập không thể thay đổi để bảo mật tài khoản"
            />
          </div>

          <div>
            <label className="text-xs uppercase tracking-wider text-text-muted font-medium mb-2 flex items-center gap-1.5">
              <Phone size={16} className="text-primary" /> Số Điện Thoại
            </label>
            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={onChange}
              required
              className="w-full p-4 border border-border/80 rounded-2xl focus:outline-none focus:border-primary transition-colors text-sm bg-white font-normal"
              placeholder="Nhập số điện thoại"
            />
          </div>
        </div>

        {/* Địa chỉ giao hàng */}
        <div>
          <label className="text-xs uppercase tracking-wider text-text-muted font-medium mb-2 flex items-center gap-1.5">
            <MapPin size={16} className="text-primary" /> Địa Chỉ Giao Hàng Chi Tiết
          </label>
          <textarea
            name="address"
            rows="3"
            value={formData.address}
            onChange={onChange}
            className="w-full p-4 border border-border/80 rounded-2xl focus:outline-none focus:border-primary transition-colors text-sm bg-white resize-none font-light leading-relaxed"
            placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố..."
          />
        </div>

        {/* Nút Submit */}
        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={updating}
            className="group inline-flex items-center gap-2.5 bg-text-main text-white px-9 py-4 rounded-full font-semibold uppercase tracking-[2px] text-xs hover:bg-primary hover:-translate-y-1 hover:shadow-float transition-all duration-300 disabled:opacity-50 cursor-pointer"
          >
            <FloppyDisk size={18} className="group-hover:scale-110 transition-transform" />
            {updating ? 'Đang Lưu Thông Tin...' : 'Lưu Thay Đổi'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;
