# Mini Google Drive API 📂

Project belajar backend membuat layanan penyimpanan file sederhana (File Storage Service) menggunakan Node.js.

## Tech Stack
* **Runtime:** Node.js
* **Language:** JavaScript (ES6 Modules)
* **Framework:** Express.js
* **Database:** MySQL
* **ORM:** Prisma
* **Testing:** Vitest & Supertest

## Fitur Utama
* ✅ Register & Login (JWT Auth)
* ✅ Upload File (Multer Stream)
* ✅ Create Recursive Folder (Folder dalam Folder)
* ✅ Download File (Stream Processing)
* ✅ Delete Folder & File (Cascade Delete)

## Cara Menjalankan (Local)
1. Clone repo ini
2. `npm install`
3. Copy `.env.example` ke `.env` dan setup database
4. `npx prisma migrate dev`
5. `npm start`