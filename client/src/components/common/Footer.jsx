const Footer = () => {
  return (
    <footer className="bg-accent pt-12 border-t border-border">
      <div className="container-custom flex justify-between flex-wrap gap-8 mb-12">
        <div className="max-w-[300px]">
          <div className="flex items-center gap-2 mb-4">
            <img src="/Lumiere.png" alt="Lumière Logo" className="h-8 object-contain" />
            <h2 className="font-heading text-4xl text-primary font-bold">Lumière</h2>
          </div>
          <p className="text-text-muted leading-relaxed">
            Thời trang nữ cao cấp, tôn vinh vẻ đẹp hiện đại và thanh lịch của phái đẹp.
          </p>
        </div>
        
        <div className="flex gap-16">
          <div className="flex flex-col gap-4">
            <h3 className="text-base uppercase tracking-wide mb-2">Cửa hàng</h3>
            <a href="#" className="text-text-muted hover:text-primary transition-colors">Hàng mới về</a>
            <a href="#" className="text-text-muted hover:text-primary transition-colors">Sản phẩm bán chạy</a>
            <a href="#" className="text-text-muted hover:text-primary transition-colors">Giảm giá</a>
          </div>
          <div className="flex flex-col gap-4">
            <h3 className="text-base uppercase tracking-wide mb-2">Hỗ trợ</h3>
            <a href="#" className="text-text-muted hover:text-primary transition-colors">Chính sách đổi trả</a>
            <a href="#" className="text-text-muted hover:text-primary transition-colors">Hướng dẫn chọn size</a>
            <a href="#" className="text-text-muted hover:text-primary transition-colors">Chăm sóc khách hàng</a>
          </div>
        </div>
      </div>
      <div className="text-center py-6 border-t border-black/5 text-text-muted text-sm">
        <p>&copy; {new Date().getFullYear()} Lumière. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
