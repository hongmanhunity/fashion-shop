import { Sparkle, ShieldCheck } from "@phosphor-icons/react";

const ProfileHeader = ({ user }) => {
  return (
    <div className="bg-surface py-8 border-b border-border">
      <div className="container-custom max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[4px] font-semibold text-primary mb-1">
            <Sparkle size={13} /> Hồ Sơ Thành Viên Lumière
          </span>
          <h1 className="text-2xl sm:text-3xl font-heading text-text-main font-medium">
            Xin chào, {user.lastname || "Thành viên"}!
          </h1>
          <p className="text-text-muted text-xs sm:text-sm font-light mt-1">
            Quản lý thông tin tài khoản và địa chỉ nhận hàng của bạn.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white/90 px-4 py-2.5 rounded-xl border border-border shadow-xs">
          <ShieldCheck size={24} className="text-primary" />
          <div className="text-left">
            <p className="text-xs font-semibold text-text-main">
              Tài khoản Xác Thực
            </p>
            <p className="text-[10px] text-text-muted">Bảo mật Lumière</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
