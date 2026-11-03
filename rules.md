# Development Rules & Guidelines

## 1. Git & Commit Strategy: Aturan Mutlak Memaksimalkan Frekuensi & Jumlah Commit
> [!IMPORTANT]
> **DILARANG KERAS MELAKUKAN "SINGLE BIG COMMIT" / COMMIT SEKALIGUS.**
> Setiap tugas atau permintaan pengguna HARUS dipecah menjadi beberapa commit berbutir halus (*fine-grained atomic commits*). Setiap langkah pekerjaan yang terisolasi wajib langsung di-commit sebelum beralih ke langkah berikutnya.

### A. Aturan Pemecahan Langkah Kerja Menjadi Banyak Commit
Saat mengerjakan suatu task, **wajib** memecahnya ke dalam tahapan commit terpisah berikut:
1. **Fase Persiapan & Aset:**
   - Commit 1: Penambahan/pembaruan file aset mentah (gambar, ikon, font, SVG, cutout).
   - Commit 2: Penambahan library/dependensi baru atau konfigurasi build jika ada.
2. **Fase Tipe Data & Skema:**
   - Commit 3: Penambahan/update interface TypeScript, type definitions (`.d.ts`), atau skema data.
3. **Fase Data / Mock / State:**
   - Commit 4: Penambahan data statis, konstanta, atau utility helper functions.
4. **Fase Komponen UI / Primitives:**
   - Commit 5: Pembuatan komponen dasar atau sub-komponen UI terisolasi.
   - Commit 6: Penyesuaian styling khusus / CSS / animasi per komponen.
5. **Fase Integrasi Halaman:**
   - Commit 7: Penghubungan komponen ke section atau halaman utama (`page.tsx` / `Section.tsx`).
   - Commit 8: Penyesuaian responsive layout (mobile / tablet / desktop).
6. **Fase Verifikasi & Polishing:**
   - Commit 9: Perbaikan edge-case / layout tuning setelah testing lokal.
   - Commit 10: Pembaruan dokumentasi, metadata, atau rules.

### B. Prinsip "One Thought, One Action, One Commit"
- **Jangan menunggu semua selesai baru commit:** Segera setelah 1 file atau 1 logic unit selesai dimodifikasi dan valid, langsung lakukan `git add <file>` dan `git commit`.
- **Satu jenis tindakan per commit:** Pisahkan antara *refactor*, *style fix*, *asset update*, dan *feature logic*. Jangan mencampurkan perubahan CSS dengan perubahan data dalam 1 commit jika bisa dipisahkan secara logis.
- **Minimal 2–5 commit untuk setiap prompt / permintaan pengguna** (kecuali task trivial 1 baris). Jika permintaan melibatkan lebih dari 1 file, pecah menjadi commit per file atau per concern.

### C. Standar Format Pesan Commit (Conventional Commits)
Gunakan format terstruktur berikut:
- `feat(...)`: Penambahan fungsionalitas, komponen, atau fitur baru.
- `asset(...)` / `feat(assets)`: Penambahan atau optimasi aset gambar, ikon, atau media.
- `style(...)`: Penyesuaian estetika visual, CSS class, animasi, transisi, atau spacing.
- `fix(...)`: Perbaikan bug, layout shift, typo, atau logic error.
- `refactor(...)`: Restrukturisasi kode tanpa mengubah fungsionalitas.
- `perf(...)`: Peningkatan performa, optimasi ukuran aset, atau lazy loading.
- `test(...)`: Penambahan atau pembaruan unit test / E2E test script.
- `docs(...)`: Pembaruan dokumentasi, rules, atau README.
- `chore(...)`: Penyesuaian dependensi, skrip npm, atau konfigurasi repository.

### D. Checklist Workflow Commit
1. Jalankan `git status -s` untuk melihat file yang berubah.
2. Stage file secara spesifik (hindari `git add .` membabi-buta):
   ```bash
   git add path/to/specific/file.ts
   git commit -m "feat(scope): penjelasan spesifik langkah ini"
   ```
3. Ulangi untuk file berikutnya dengan pesan commit yang sesuai.
4. Jalankan `npm run type-check` dan `npm run build` sebelum `git push`.
5. Push semua commit yang sudah terakumulasi secara bertahap atau sekaligus ke remote branch.

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
