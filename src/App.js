import React from "react";
// ملاحظة: يمكنك استبدال مسار الشعار لاحقاً بصورة حقيقية
function App() {
  return (
    <div className="container">
      <header>
        <div className="logo" />
        <h1>SebairTel</h1>
        <p className="subtitle">منصة الاتصالات الذكية</p>
      </header>
      <main>
        <section>
          <h2>مرحبًا بك!</h2>
          <p>
            هذا هو الإصدار الجديد لتطبيق SebairTel باستخدام React، جاهز للنشر والعمل فورًا.<br />
            يمكنك تطوير المزيد من الصفحات والمميزات بسهولة.
          </p>
        </section>
      </main>
      <footer>
        <small>© 2025 SebairTel. جميع الحقوق محفوظة.</small>
      </footer>
    </div>
  );
}

export default App;