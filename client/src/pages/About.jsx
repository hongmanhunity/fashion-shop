import { Link } from 'react-router-dom';
import { Sparkle, Crown, Plant, Heart, ArrowRight } from '@phosphor-icons/react';

const About = () => {
  return (
    <div className="bg-background text-text-main">
      {/* 1. Hero Section */}
      <section className="relative bg-surface py-20 lg:py-28 border-b border-border overflow-hidden">
        <div className="container-custom relative z-10 text-center max-w-4xl mx-auto">
          <span className="inline-block text-xs uppercase tracking-[4px] font-semibold text-primary mb-4 px-4 py-1.5 rounded-full bg-accent/40 border border-primary/20 hover:scale-105 transition-transform cursor-default">
            Về Thương Hiệu Lumière
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading leading-tight mb-6">
            Ánh Sáng Định Hình <br className="hidden sm:block" /> Phong Cách & Thần Thái
          </h1>
          <p className="text-base sm:text-lg text-text-muted leading-relaxed max-w-2xl mx-auto font-light">
            Khởi nguồn từ niềm đam mê thời trang thuần khiết và khát vọng tôn vinh khí chất độc bản, 
            Lumière mang đến những thiết kế tối giản, thượng hạng vượt thời gian.
          </p>
        </div>
      </section>

      {/* 2. Story Section */}
      <section className="py-20 container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative group cursor-pointer">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-[#F5F5F5] shadow-float">
              <img 
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop" 
                alt="Lumière Story" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            </div>
            <div className="absolute -bottom-8 -right-8 bg-white/95 backdrop-blur-md p-6 rounded-2xl border border-border shadow-soft hidden sm:block max-w-xs group-hover:-translate-y-2 group-hover:shadow-float transition-all duration-300">
              <p className="font-heading text-2xl text-primary font-bold mb-1">Lumière</p>
              <p className="text-xs text-text-muted italic">"Trong tiếng Pháp, Lumière có nghĩa là Ánh Sáng – Thắp sáng nét đẹp vốn có của bạn."</p>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <span className="text-xs uppercase tracking-[3px] font-semibold text-primary">
              Câu Chuyện Thương Hiệu
            </span>
            <h2 className="text-3xl sm:text-4xl font-heading leading-snug">
              Hành Trình Kiến Tạo Vẻ Đẹp Tinh Tế & Độc Bản
            </h2>
            <p className="text-text-muted leading-relaxed">
              Thành lập vào năm 2021, Lumière ra đời với một niềm tin đơn giản nhưng mạnh mẽ: 
              Trang phục không chỉ để mặc, mà là một ngôn ngữ biểu đạt thần thái và sự tự tin nội tại. 
              Chúng tôi chắt lọc những đường nét kiến trúc tối giản kết hợp cùng kỹ thuật cắt may thủ công tỉ mỉ.
            </p>
            <p className="text-text-muted leading-relaxed">
              Mỗi bộ sưu tập của Lumière là sự giao thoa hài hòa giữa cảm hứng thời trang Pháp thanh lịch 
              và nét đẹp duyên dáng, hiện đại của người phụ nữ Việt. Chúng tôi lựa chọn kỹ lưỡng từng thước vải tự nhiên, 
              đảm bảo sự êm ái tuyệt đối trên làn da và độ bền đẹp vượt năm tháng.
            </p>
          </div>
        </div>
      </section>

      {/* 3. History Timeline Section */}
      <section className="py-20 bg-surface border-y border-border">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-[3px] font-semibold text-primary mb-3 block">
              Dấu Ấn Phát Triển
            </span>
            <h2 className="text-3xl sm:text-4xl font-heading">Lịch Sử Hình Thành</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group bg-background p-8 rounded-2xl border border-border relative hover:border-primary/50 hover:-translate-y-2 hover:shadow-float transition-all duration-300 cursor-pointer">
              <span className="text-4xl font-heading font-bold text-primary/30 group-hover:text-primary group-hover:scale-105 transition-all duration-300 mb-4 block">2021</span>
              <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">Khởi Nguồn Ý Tưởng</h3>
              <p className="text-sm text-text-muted leading-relaxed">
                Xưởng thiết kế nhỏ đầu tiên ra đời tại Hà Nội với định hướng thời trang Minimalist Luxe độc bản.
              </p>
            </div>

            <div className="group bg-background p-8 rounded-2xl border border-border relative hover:border-primary/50 hover:-translate-y-2 hover:shadow-float transition-all duration-300 cursor-pointer">
              <span className="text-4xl font-heading font-bold text-primary/30 group-hover:text-primary group-hover:scale-105 transition-all duration-300 mb-4 block">2023</span>
              <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">Dấu Ấn Khai Trương</h3>
              <p className="text-sm text-text-muted leading-relaxed">
                Ra mắt Flagship Store đầu tiên và bộ sưu tập "Lumière De L'Aube" gây tiếng vang lớn trong giới mộ điệu.
              </p>
            </div>

            <div className="group bg-background p-8 rounded-2xl border border-border relative hover:border-primary/50 hover:-translate-y-2 hover:shadow-float transition-all duration-300 cursor-pointer">
              <span className="text-4xl font-heading font-bold text-primary/30 group-hover:text-primary group-hover:scale-105 transition-all duration-300 mb-4 block">2025</span>
              <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">Vươn Mình Phát Triển</h3>
              <p className="text-sm text-text-muted leading-relaxed">
                Hoàn thiện hệ sinh thái e-commerce hiện đại, phục vụ hơn 50.000+ khách hàng yêu thời trang toàn quốc.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Core Values */}
      <section className="py-20 container-custom">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[3px] font-semibold text-primary mb-3 block">
            Triết Lý Kinh Doanh
          </span>
          <h2 className="text-3xl sm:text-4xl font-heading">Giá Trị Cốt Lõi</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="group flex flex-col items-center text-center p-8 rounded-2xl bg-surface border border-border hover:border-primary/50 hover:-translate-y-2 hover:shadow-float transition-all duration-300 cursor-pointer">
            <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white group-hover:rotate-6 group-hover:scale-110 transition-all duration-300">
              <Sparkle size={30} />
            </div>
            <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">Độc Bản & Tinh Tế</h3>
            <p className="text-xs text-text-muted leading-relaxed">Từng đường kim mũi chỉ đều được trau chuốt tỉ mỉ bởi những nghệ nhân lành nghề.</p>
          </div>

          <div className="group flex flex-col items-center text-center p-8 rounded-2xl bg-surface border border-border hover:border-primary/50 hover:-translate-y-2 hover:shadow-float transition-all duration-300 cursor-pointer">
            <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white group-hover:rotate-6 group-hover:scale-110 transition-all duration-300">
              <Plant size={30} />
            </div>
            <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">Chất Liệu Cao Cấp</h3>
            <p className="text-xs text-text-muted leading-relaxed">Ưu tiên sử dụng tơ tằm, linen tự nhiên và cotton hữu cơ thân thiện với làn da.</p>
          </div>

          <div className="group flex flex-col items-center text-center p-8 rounded-2xl bg-surface border border-border hover:border-primary/50 hover:-translate-y-2 hover:shadow-float transition-all duration-300 cursor-pointer">
            <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white group-hover:rotate-6 group-hover:scale-110 transition-all duration-300">
              <Crown size={30} />
            </div>
            <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">Tôn Vinh Khí Chất</h3>
            <p className="text-xs text-text-muted leading-relaxed">Thiết kế tôn dáng tự nhiên, đem lại thần thái kiêu hãnh và sự tự tin cho người mặc.</p>
          </div>

          <div className="group flex flex-col items-center text-center p-8 rounded-2xl bg-surface border border-border hover:border-primary/50 hover:-translate-y-2 hover:shadow-float transition-all duration-300 cursor-pointer">
            <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white group-hover:rotate-6 group-hover:scale-110 transition-all duration-300">
              <Heart size={30} />
            </div>
            <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">Tận Tâm Phục Vụ</h3>
            <p className="text-xs text-text-muted leading-relaxed">Dịch vụ chăm sóc khách hàng tư vấn cá nhân hóa chuẩn mực thương hiệu cao cấp.</p>
          </div>
        </div>
      </section>

      {/* 5. Founder Message */}
      <section className="py-24 bg-surface border-t border-border">
        <div className="container-custom max-w-4xl text-center">
          <span className="inline-block text-6xl text-primary font-heading mb-2 hover:scale-125 hover:rotate-12 transition-transform duration-300 cursor-pointer select-none">“</span>
          <blockquote className="text-2xl sm:text-3xl font-heading leading-snug text-text-main mb-8 font-medium tracking-tight">
            Tại Lumière, chúng tôi không chạy theo những xu hướng thoáng qua. Chúng tôi sáng tạo ra những thiết kế bền vững – nơi sự tối giản chính là biểu tượng cao nhất của sự sang trọng.
          </blockquote>
          <p className="font-semibold text-text-main tracking-[4px] uppercase text-xs">Ban Giám Đốc Sáng Tạo Lumière</p>
        </div>
      </section>

      {/* 6. CTA Section */}
      <section className="py-20 container-custom text-center">
        <h2 className="text-3xl font-heading mb-4">Trải Nghiệm Thiết Kế Lumière</h2>
        <p className="text-text-muted mb-8 max-w-md mx-auto">Khám phá ngay các bộ sưu tập mới nhất để tìm thấy phong cách dành riêng cho bạn.</p>
        <Link 
          to="/products" 
          className="group inline-flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-full font-semibold uppercase tracking-widest text-sm hover:bg-primary-hover hover:-translate-y-1 hover:shadow-float transition-all duration-300"
        >
          Khám phá bộ sưu tập 
          <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform duration-300" />
        </Link>
      </section>
    </div>
  );
};

export default About;
