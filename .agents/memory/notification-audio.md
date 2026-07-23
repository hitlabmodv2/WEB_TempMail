---
name: Notification audio
description: Sumber dan fallback audio notifikasi inbox.
---

Audio notifikasi dapat memakai file MP3 dari Raw GitHub repository sendiri, dengan fallback ke file lokal aplikasi.

**Why:** URL lokal bisa berbeda antar deployment, sedangkan browser juga dapat menolak `audio.play()` karena kebijakan autoplay.

**How to apply:** Pastikan URL Raw GitHub mengembalikan HTTP 200 dan MIME `audio/mpeg`, sediakan fallback lokal, dan tangani error `play()` tanpa melemparkannya ke console atau mengganggu polling inbox.