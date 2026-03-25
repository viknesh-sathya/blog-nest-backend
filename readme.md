# BlogNest Backend 📝

Backend API for the BlogNest application built with **Express + MongoDB**.  
Handles authentication, CRUD operations for posts, categories, and user management.

---

## 🚀 Features

- REST API with Express
- MongoDB with Mongoose
- Authentication via Clerk
- Image uploads with ImageKit
- Logging with Morgan
- Secure deployment with environment variables

---

## ⚙️ Setup

### 1.Clone the repo:

        git clone https://github.com/your-username/blognest-backend.git

### 2.Install dependencies:

        npm install

### 3.Add environment variables in .env:

    # GENERAL
        PORT=3000
        NODE_ENV=development
        CLIENT_URL=http://localhost:5173

    # DATABASE
        DATABASE_URL=your-mongo-uri
        DATABASE_PASSWORD=your-password

    # CLERK
        CLERK_WEBHOOK_SECRET=your-webhook-secret
        CLERK_PUBLISHABLE_KEY=your-publishable-key
        CLERK_SECRET_KEY=your-secret-key

    # IMAGEKIT
        IMAGEKIT_URL_ENDPOINT=your-endpoint
        IMAGEKIT_PUBLIC_KEY=your-public-key
        IMAGEKIT_PRIVATE_KEY=your-private-key

### 4.Run locally:

        npm run dev
