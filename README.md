# 🎬 MovieLoom

**MovieLoom** is a high-performance web application for movie management and discovery. It bridges the gap between massive cinematic databases and secure user experiences, leveraging a cutting-edge tech stack including **Fastify**, **Prisma**, **TMDB API**, and **Docker**.

---

## 🛠️ Tech Stack

### **Backend**
* **Runtime:** Node.js
* **Framework:** [Fastify](https://www.fastify.io/)
* **Database:** PostgreSQL
* **ORM:** [Prisma](https://www.prisma.io/)
* **External API:** [TMDB API](https://www.themoviedb.org/documentation/api)
* **Authentication:** JWT (JSON Web Tokens)
* **MFA/Security:** [Twilio](https://www.twilio.com/) (OTP verification)

### **Frontend**
* **Framework:** React.js
* **Build Tool:** Vite

---

## ✨ Key Features

* 🍿 **Dynamic Content:** Real-time movie data fetching via **TMDB API**.
* 🔐 **Advanced Authentication:** Secure user login and registration using JWT.
* 📱 **OTP Verification:** Two-Factor Authentication (2FA) via **Twilio**.
* 🛡️ **Role-Based Authorization:** Granular access control for users and administrators.
* 🐳 **Dockerized Workflow:** Fully containerized PostgreSQL environment.

---

## 🚀 Getting Started

Follow these steps precisely to set up the project locally:

### 1. Prerequisites
Ensure you have **Node.js** (v18+) and **Docker** installed.

### 2. Environment Setup (Required Variables)
Create a `.env` file in the **backend** directory. You will need to provide the following variables:

```env
# Database Configuration
DATABASE_URL=postgres://[DB_USER]:[DB_PASSWORD]@localhost:5432/[DB_NAME]

# Authentication & Security
JWT_SECRET=your_jwt_secret_key
ADMIN_CREATION_KEY=your_admin_key
NODE_ENV=development

# Twilio Credentials (from twilio.com)
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# TMDB API Configuration (from themoviedb.org)
TMDB_API_KEY=your_tmdb_api_key