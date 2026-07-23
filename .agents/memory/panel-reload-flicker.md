---
name: Panel reload flicker
description: Prinsip pemulihan panel UI saat refresh halaman.
---

Untuk UI multi-panel yang mengingat panel terakhir, state panel harus dibaca sebelum body dirender dan panel yang tidak dipilih harus disembunyikan secara eksplisit.

**Why:** Pemulihan yang menunggu `DOMContentLoaded` atau hanya mengandalkan JavaScript di akhir body membuat panel default sempat terlihat saat reload.

**How to apply:** Gunakan state awal di `<head>`, CSS hide/show tegas untuk semua panel, dan tetap sinkronkan state tersebut saat pengguna berpindah panel.