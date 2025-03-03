# IMF Gadget API

## 🚀 Introduction
The **IMF Gadget API** is a simple CRUD API built with **Node.js, Express, PostgreSQL (NeonDB), and Drizzle ORM**. It allows users to **sign up, sign in, and manage their own gadgets**. Each gadget is linked to a specific user.

---

## 📌 Features
- **User Authentication** (Signup & Signin using JWT & Bcrypt)
- **Secure Password Storage**
- **CRUD Operations on Gadgets** (Create, Read, Update, Delete)
- **Each User Manages Their Own Gadgets**
- **Drizzle ORM with NeonDB for Database Management**
- **Random Gadget Name Generation**
- **Error Handling & Validation**

---

## 🏗️ Tech Stack
- **Node.js**
- **Express.js**
- **Drizzle ORM**
- **PostgreSQL (NeonDB)**
- **Bcrypt (Password Hashing)**
- **JWT (Authentication)**
- **Dotenv (Environment Variables)**
- **Random Words (Generate Gadget Names)**

---

## 🔧 Installation & Setup

### 1️⃣ Clone the Repository
```sh
git clone https://github.com/amyansu/imf-gadget-api.git
cd imf-gadget-api
```

### 2️⃣ Install Dependencies
```sh
npm install
```

### 3️⃣ Set Up Environment Variables
Create a `.env` file in the root directory and add:
```env
DATABASE_URL=your_neondb_url
JWT_SECRET=your_secret_key
```

### 4️⃣ Start the Server
```sh
node index.js
```
Server runs on **http://localhost:3000**

---

## 📌 API Endpoints

### 📝 **Authentication Routes**

#### 🔹 **User Signup**
**Endpoint:** `POST /auth/signup`
- **Body:** `{ "username": "example", "password": "password123" }`
- **Response:** `{ "message": "User created successfully", "token": "..." }`

#### 🔹 **User Signin**
**Endpoint:** `POST /auth/signin`
- **Body:** `{ "username": "example", "password": "password123" }`
- **Response:** `{ "message": "Logged in successfully", "token": "..." }`

### 🛠️ **Gadget Routes (Require Authentication)**
🔹 **Include JWT Token in `Authorization` Header**: `Authorization: Bearer <your_token>`

#### 📌 **Get User's Gadgets**
**Endpoint:** `GET /gadgets`
- **Response:** `[{ "id": "uuid", "name": "The Gadget", "status": "Active" }]`

#### 📌 **Add a New Gadget**
**Endpoint:** `POST /gadgets/add`
- **Response:** `{ "id": "uuid", "name": "The Gadget" }`

#### 📌 **Update Gadget Status**
**Endpoint:** `PATCH /gadgets/update/:id`
- **Body:** `{ "status": "Updated Status" }`
- **Response:** `{ "id": "uuid", "status": "Destroyed" }`

#### 📌 **Delete (Decommission) Gadget**
**Endpoint:** `DELETE /gadgets/delete/:id`
- **Response:** `{ "id": "uuid", "status": "Decommissioned" }`

---

## 🚀 Future Enhancements
- ✅ User Profile Management
- ✅ Gadget Filtering & Sorting
- ✅ Role-Based Access Control (Admin/User)
- ✅ API Documentation with Swagger

---

## 👨‍💻 Author
**[Amyansu]**  
GitHub: [@amyansu](https://github.com/amyansu)

