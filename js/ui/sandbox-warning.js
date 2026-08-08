/**
 * ReadBridge — Sandbox Warning Banner
 * Tanggung Jawab: Menampilkan banner bahwa website ini adalah prototype/sandbox.
 */

function initWarning() {
  if (document.getElementById("rb-warning-styles")) return;

  const style = document.createElement("style");
  style.id = "rb-warning-styles";
  style.textContent = `
    .rb-warning-banner {
      display: flex; align-items: center; justify-content: center; gap: 12px;
      padding: 10px 24px; background-color: #fffbeb; border-bottom: 1px solid #fde68a;
      color: #b45309; font-family: "Plus Jakarta Sans", system-ui, sans-serif;
      font-size: 13px; font-weight: 600; text-align: center;
      position: relative; z-index: 100000; transition: all 0.3s ease;
    }
    .dark .rb-warning-banner {
      background-color: #78350f; border-bottom: 1px solid #92400e; color: #fef3c7;
    }
    .rb-warning-banner .rb-close-btn {
      background: none; border: none; color: currentColor; font-size: 18px;
      cursor: pointer; padding: 4px; margin-left: 8px; display: inline-flex;
      align-items: center; justify-content: center; opacity: 0.7; transition: opacity 0.2s; line-height: 1;
    }
    .rb-warning-banner .rb-close-btn:hover { opacity: 1; }
    .rb-warning-modal-overlay {
      position: fixed; inset: 0; background-color: rgba(15, 23, 42, 0.6);
      backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
      display: flex; align-items: center; justify-content: center;
      z-index: 200000; opacity: 0; transition: opacity 0.4s ease; padding: 16px;
    }
    .rb-warning-modal-overlay.active { opacity: 1; }
    .rb-warning-modal-box {
      background-color: #ffffff; color: #0f172a; width: 100%; max-width: 520px;
      padding: 32px; border-radius: 24px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
      transform: scale(0.9); transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
      font-family: "Plus Jakarta Sans", system-ui, sans-serif; border: 1px solid rgba(226, 232, 240, 0.8);
    }
    .dark .rb-warning-modal-box {
      background-color: #1e293b; color: #f8fafc; border: 1px solid rgba(51, 65, 85, 0.8);
    }
    .rb-warning-modal-overlay.active .rb-warning-modal-box { transform: scale(1); }
    .rb-warning-modal-title { font-size: 20px; font-weight: 700; margin: 0 0 16px 0; color: #d97706; display: flex; align-items: center; gap: 8px; }
    .dark .rb-warning-modal-title { color: #fbbf24; }
    .rb-warning-modal-text { font-size: 14px; line-height: 1.6; margin-bottom: 20px; opacity: 0.9; }
    .rb-warning-modal-list { list-style: none; padding: 0; margin: 0 0 28px 0; display: flex; flex-direction: column; gap: 12px; }
    .rb-warning-modal-list li { font-size: 14px; line-height: 1.5; padding-left: 8px; }
    .rb-warning-modal-btn {
      width: 100%; padding: 14px 24px; background-color: #2563eb; color: #ffffff;
      border: none; border-radius: 9999px; font-size: 14px; font-weight: 600;
      cursor: pointer; transition: all 0.2s ease; box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);
    }
    .rb-warning-modal-btn:hover { background-color: #1d4ed8; transform: translateY(-1px); }
  `;
  document.head.appendChild(style);

  if (!sessionStorage.getItem("rb_banner_closed")) {
    const banner = document.createElement("div");
    banner.className = "rb-warning-banner";
    banner.innerHTML = `
      <span>⚠️ <strong>Mode Sandbox:</strong> Website ini adalah prototype uji coba. Transaksi & produk bersifat simulasi.</span>
      <button type="button" class="rb-close-btn" aria-label="Tutup" onclick="this.parentElement.remove(); sessionStorage.setItem('rb_banner_closed', 'true');">×</button>
    `;
    document.body.insertBefore(banner, document.body.firstChild);
  }

  if (!sessionStorage.getItem("rb_warning_seen")) {
    const overlay = document.createElement("div");
    overlay.className = "rb-warning-modal-overlay";
    
    const modalBox = document.createElement("div");
    modalBox.className = "rb-warning-modal-box";
    modalBox.innerHTML = `
      <h3 class="rb-warning-modal-title">⚠️ Pemberitahuan Penting (Prototype)</h3>
      <p class="rb-warning-modal-text">Selamat datang di <strong>ReadBridge</strong>. Harap diperhatikan bahwa website ini dibangun sebagai media <strong>prototype uji coba</strong> dan belum beroperasi secara komersial/nyata.</p>
      <ul class="rb-warning-modal-list">
        <li>📦 <strong>Produk Uji Coba:</strong> Seluruh katalog buku, jurnal, dan produk lainnya hanyalah konten simulasi untuk demonstrasi fitur.</li>
        <li>💳 <strong>Transaksi Sandbox:</strong> Proses pembayaran, sewa, beli, dan checkout di website ini hanya bersifat simulasi dan tidak memungut biaya/transaksi riil.</li>
        <li>🛠️ <strong>Masih Dikembangkan:</strong> Beberapa fitur sedang disempurnakan dan terus disinkronisasi ke server pengembangan.</li>
      </ul>
      <button type="button" class="rb-warning-modal-btn">Saya Mengerti & Setuju</button>
    `;
    
    overlay.appendChild(modalBox);
    document.body.appendChild(overlay);
    
    setTimeout(() => overlay.classList.add("active"), 50);
    
    const dismissBtn = modalBox.querySelector(".rb-warning-modal-btn");
    dismissBtn.addEventListener("click", () => {
      overlay.classList.remove("active");
      sessionStorage.setItem("rb_warning_seen", "true");
      setTimeout(() => overlay.remove(), 400);
    });
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initWarning);
} else {
  initWarning();
}
