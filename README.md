# 🌤️ WeatherPulse - Aplikasi Cuaca Real-Time Modern

Aplikasi prakiraan cuaca real-time yang responsif, modern, dan kaya fitur dibangun menggunakan **React**, **TypeScript**, **Vite**, dan **Tailwind CSS**.

![Weather App Preview](https://img.shields.io/badge/React-19-blue?logo=react) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript) ![Vite](https://img.shields.io/badge/Vite-8-purple?logo=vite) ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-cyan?logo=tailwindcss)

## ✨ Fitur Utama

-  **Pencarian Kota Global**: Pencarian nama kota secara langsung dengan rekomendasi cepat (*Jakarta, Bandung, Surabaya, Tokyo, London*).
-  **Deteksi Lokasi Terkini**: Fitur geolokasi browser untuk menampilkan cuaca berdasarkan posisi Anda saat ini.
-  **Suhu Real-Time & Toggle Unit**: Tampilan suhu besar dengan kemampuan beralih antara Celsius (°C) dan Fahrenheit (°F).
-  **Detail Parameter Cuaca**: Kelembaban (humidity), kecepatan & arah angin, tekanan udara, jarak pandang (visibility), serta waktu matahari terbit & terbenam.
-  **Prakiraan Cuaca (Forecast)**: Tab prakiraan cuaca **5 Hari** dan **Per Jam** lengkap dengan persentase peluang hujan.
-  **Multi-API Support & Fallback System**:
  - Mendukung **OpenWeatherMap API Key** pribadi.
  - Memiliki **Free Auto-Fallback API (Open-Meteo)** sehingga aplikasi langsung dapat digunakan tanpa konfigurasi API Key.
-  **Glassmorphism & Dynamic Themes**: Latar belakang yang berubah warna secara otomatis menyesuaikan kondisi cuaca (*Cerah, Malam, Berawan, Hujan, Badai Petir, Salju*).

## 🚀 Cara Menjalankan Project

### Prasyarat
- [Node.js](https://nodejs.org/) (Versi 18 atau lebih baru)

### Langkah Install & Jalankan

1. **Clone repository ini:**
   ```bash
   git clone https://github.com/adiwira123/Aplikasi-Cuaca-Sederhana-Menggunakan-React.git
   cd Aplikasi-Cuaca-Sederhana-Menggunakan-React
   ```

2. **Install dependensi:**
   ```bash
   npm install
   ```

3. **Jalankan server pengembang (Dev Server):**
   ```bash
   npm run dev
   ```

4. **Buka di browser:**
   Akses `http://localhost:5173` di browser favorit Anda.

## 🛠️ Teknologi yang Digunakan

- **Frontend Core**: React 19, TypeScript
- **Build Tool**: Vite
- **Styling & Theme**: Tailwind CSS v4, Glassmorphism UI
- **Icon Set**: Lucide React
- **API Integration**: OpenWeatherMap API & Open-Meteo API
