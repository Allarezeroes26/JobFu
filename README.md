# 🏢 JobFu (Job Portal Web App)

JobFu is a modern job portal web application designed to connect job seekers with employers efficiently. It provides features for job listings, applications, user profiles, and real-time interaction between employers and job seekers.

---

## Demo

https://jobfufrontend.onrender.com

---

### 😊 Test Accounts:

  ### Employer Account:
  ```
  Email: alice@techcorp.com
  Password: alice 1234567890
  ```

  ### Seeker Account:
  ```
  Email: johndoe@gmail.com
  Password: john 1234567890
  ```

---

# 🚀 Features

- User Roles: Separate dashboards for Job Seekers and Employers.
- Job Listings: Employers can post, edit, and delete jobs.
- Job Applications: Job seekers can apply for jobs with a single click.
- Profile Management: Users can manage personal and professional details.
- Search & Filters: Search jobs by keywords, location, or category.

---

# ⚙️ Tech Stack

- Frontend: React, Tailwind CSS, Shadcn UI
- Backend: Node.js, Express.js
- Database: MongoDB, Mongoose
- State Management: Zustand
- Authentication: JWT, bcrypt
- Deployment: Render

---

# 🧠 Installation

## Clone the repository:
```
git clone https://github.com/yourusername/jobfu.git
cd jobfu
```

## Install backend dependencies:

```
cd server
npm install
```

## Install frontend dependencies:

```
cd ../client
npm install
```

## Create a .env file in the server directory:

```
PORT = 5001
MONGO_URI='your_mongodb_uri'
JWT_SECRET = 'your_jwt_secret'
FRONTEND = 'your_frontend_link'
CLOUDINARY_API_SECRET= "your_cloudinary_secret_key"
CLOUDINARY_API_KEY= "your_cloudinary_api_key"
CLOUDINARY_NAME= "your_cloudinary_name"
```

## Run the backend server:
```
cd server
npm run dev
```
## Run the frontend:
```
cd client
npm start
```
Open http://localhost:3000
 to view it in the browser.

 ---

# Usage

### For Job Seekers:

Sign up or log in <br/>
Browse and apply to jobs <br/>
Update profile and resume <br/>

### For Employers:

Sign up or log in <br/>
Post and manage job listings <br/>
Review applications and connect with candidates <br/>
