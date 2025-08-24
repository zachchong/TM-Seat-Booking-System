# Seat Booking System

A Node.js and Express-based web application for managing seat bookings with authentication, booking forms, feedback, and user account management.  

## 📌 Features
- 🔑 **Authentication**: User login, signup, and secure password reset  
- 📅 **Booking Management**: Submit new bookings and view existing ones  
- 📝 **Feedback System**: Collect feedback from users  
- 👤 **User Accounts**: Update and manage user profile and bookings  

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/your-username/seat-booking-system.git
cd seat-booking-system
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup environment variables  
Create a `.env` file in the root directory:  

### 4. Run the app
```bash
npm run build
```

The app should now be running on **http://localhost:3000** 🚀  

## ⚙️ Tech Stack
- **Backend**: Node.js, Express.js  
- **Database**: MongoDB (or your chosen DB)  
- **Authentication**: Sessions / JWT  
- **Other**: dotenv for environment variables  

## 📬 API Endpoints (examples)
| Endpoint           | Method | Description                  |
|--------------------|--------|------------------------------|
| `/login`           | POST   | User login                   |
| `/signup`          | POST   | Create new account           |
| `/submitBooking`   | POST   | Submit a new booking         |
| `/myBookings`      | GET    | View user's bookings         |
| `/feedback`        | POST   | Submit feedback              |
| `/reset`           | POST   | Reset user password          |

## 🛠️ Future Improvements
- ✅ Add email notifications for bookings  
- ✅ Admin panel for managing bookings  
- ✅ Role-based access control  

## 👨‍💻 Author
Built with ❤️ by [Zach Chong]  
