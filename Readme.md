# 🕌 Mosque Finance Manager

A full-stack web application to manage mosque finances, track donations and expenses, manage salaries, and generate reports — designed for transparency, simplicity, and mobile use.

This system is built for mosque administrators and volunteers to digitize manual donation records, automate monthly reports, and ensure accountability.

---

## 🧩 Tech Stack

| Layer        | Technology                         |
|--------------|-------------------------------------|
| Frontend     | React + Vite + Tailwind (Mobile Friendly) |
| Backend      | Node.js + Express + MongoDB         |
| Auth         | JWT Token Authentication            |
| File Uploads | Multer (with secure static hosting) |
| Styling      | Tailwind CSS                        |
| Data Format  | RESTful APIs + JSON                 |

---

## 📁 Project Structure

Gulshan-Masjid-App/
├── backend/
│ ├── models/
│ ├── routes/
│ ├── middleware/
│ ├── uploads/
│ ├── server.js
│ └── .env
├── frontend/
│ ├── src/
│ ├── public/
│ └── vite.config.js
└── README.md



---

## 🔐 Roles & Permissions

| Role       | Description                            |
|------------|----------------------------------------|
| `admin`    | Full control: users, transactions, categories, reports |
| `accountant` | Can add/edit transactions            |
| `user`     | View-only access to dashboard and reports |

---

## 🔢 Features

### ✅ Backend (Node.js + MongoDB)
- JWT-based login system
- Role-based access control
- Add/edit/delete transactions
- Auto-generated `transactionId` (e.g., `TXN-20250628-0001`)
- Receipt file uploads (images)
- Dynamic category management (admin can add/edit/remove)
- REST API for dashboard/report frontend use

### ✅ Frontend (React)
- Mobile-first, simple UI
- Login form with role-based redirection
- Transaction form with type & category
- Category management panel (admin only)
- Dashboard:
  - Total income vs expense
  - Top 10 expenses
  - Monthly bar graphs
  - Download CSV / PDF
- Filterable Reports table with search, date range, view, edit

---

## ⚙️ Setup Instructions

### ✅ Prerequisites

- Node.js v16+
- MongoDB running locally or via cloud (MongoDB Atlas)

---

### 🚀 Local Setup

```bash
git clone https://github.com/your-username/mosque-finance-manager.git
cd mosque-finance-manager


## 🔧 Backend Setup

cd backend
npm install
cp .env.example .env
# Edit MONGO_URI and JWT_SECRET in .env

# Start the backend server
npm run dev
.env example:

env

MONGO_URI=mongodb://localhost:27017/mosque_finance
JWT_SECRET=your_secret_key


💻 Frontend Setup

cd frontend
npm install
npm run dev
The frontend will run at: http://localhost:5173
The backend API is expected at: http://localhost:5000

🧪 API Endpoints
Method	Endpoint	Description	Auth Role
POST	/api/auth/login	User login	Public
GET	/api/transactions	List transactions	All
POST	/api/transactions	Add new transaction	Admin, Accountant
GET	/api/categories	List categories	All
POST	/api/categories	Create new category	Admin
PUT	/api/categories/:id	Update category	Admin
DELETE	/api/categories/:id	Delete category	Admin

🧑‍💼 Create Initial Admin User (Mongo Shell)
js
Copy
Edit
// Open Mongo shell and run:
const bcrypt = require('bcryptjs');
db.users.insertOne({
  name: "Admin",
  email: "admin@mosque.com",
  password: bcrypt.hashSync("123456", 10),
  role: "admin"
});
🧰 Future Enhancements
 
 - Staff salary slip PDF export

 - Import from Excel

 - WhatsApp / SMS notifications

 - Multilingual UI (Urdu/Arabic)

 - User registration / approval workflow

🤝 Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you'd like to change.

📄 License
This project is licensed under the MIT License.

