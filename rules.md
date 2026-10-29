# Development Rules & Guidelines

## 1. Git & Commit Strategy (Maksimalkan Jumlah Commit)
- **Atomic & Frequent Commits:**
  - Pecah setiap pekerjaan menjadi commit-commit kecil, logis, dan terisolasi (*atomic commits*).
  - Jangan menunda atau menggabungkan banyak perubahan yang tidak saling terkait ke dalam satu commit besar (*giant commit*).
  - Setiap perubahan fitur kecil, perbaikan bug, penyesuaian styling, update data, atau penambahan konfigurasi wajib dibuatkan commit tersendiri.
- **Standar Pesan Commit (Conventional Commits):**
  - `feat(...)`: penambahan fitur atau komponen baru.
  - `fix(...)`: perbaikan bug atau error.
  - `style(...)`: perapian tampilan, CSS, tema, animasi, atau penyesuaian UI.
  - `refactor(...)`: refaktor kode tanpa mengubah fungsi atau perilaku UI.
  - `docs(...)`: penambahan atau pembaruan dokumentasi/rules/README.
  - `chore(...)`: penyesuaian konfigurasi build, dependensi, atau skrip.
  - `security(...)`: penguatan celah keamanan, sanitasi input, atau proteksi header.
- **Workflow Commit:**
  - Jalankan `git status` dan pastikan hanya file terkait yang di-*stage*.
  - Lakukan commit segera setelah satu unit pekerjaan selesai dan diverifikasi.
  - Maksimalkan frekuensi commit yang rapi dan bermakna untuk menjaga riwayat git tetap terstruktur dan transparan.

---

## 2. Arsitektur & Kualitas Kode
- **Stack Utama:** Next.js 14 App Router, TypeScript, Tailwind CSS, Anime.js, GSAP.
- **Static Export Target:** Tetap jaga kompatibilitas dengan `output: "export"` (Cloudflare Pages / CDN).
- **Keamanan:**
  - Jaga sanitasi form dan batasan karakter.
  - Pertahankan aturan security headers di `public/_headers`.
  - Validasi ketat setiap URL eksternal dengan `new URL()`.
- **Verifikasi Sebelum Push:**
  - Selalu jalankan `npm run type-check` dan `npm run build` sebelum melakukan push ke branch remote.
