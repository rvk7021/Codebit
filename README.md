# Codebit – Online Coding Platform

Codebit is a scalable online coding platform designed to help developers practice coding problems, track their progress, and engage with a community of like-minded learners. It integrates a compiler, problem-tracking system, and other features that enhance the learning experience.

## Table of Contents

- Tech Stack
- Features
- Project Structure
- Setup

## Tech Stack

- **Frontend**: React, Tailwind CSS
- **Backend**: Express.js, MongoDB
- **Deployment**: Netlify (Frontend), Render (Backend)

## Features

- **Compiler Integration**: An integrated compiler for real-time code execution and testing.
- **Problem Tracking**: Users can track the problems they’ve solved and monitor their coding profiles.
- **Custom Practice Sheets**: Users can create custom practice sheets and group problems for structured learning.
- **User Authentication**: Secure login and user authentication system for managing profiles.
- **Contest Tracking**: Track progress in coding contests.
- **Community Features**: Real-time discussions and content sharing to boost user engagement.

## Project Structure

- `frontend_codebit/`: Contains the React frontend.
- `backend_codebit/`: Contains the Express.js backend API and MongoDB configurations.

## Setup

Clone the repository:
   ```bash
   git clone https://github.com/rvk7021/Codebit.git

```
### Frontend Setup
   ```bash
   cd frontend_codebit
   npm install
   npm start
  ```
### Backend Setup
```bash
   cd backend_codebit
   npm install
   npm run dev
```
### .env Configuration for Backend and Frontend

To set up the backend and frontend, you need to create two `.env` files: one for the **backend** and one for the **frontend**.

#### 1. Backend .env file:

Create the `.env` file inside the `backend_codebit/` directory. Add the following variables:

```bash
MONGODB_URL=YOUR_MONGODB_CONNECTION_STRING
JWT_SECRET=YOUR_SECRET_KEY
PORT=4000
CLOUDINARY_URL=YOUR_CLOUDINARY_URL
CLOUD_NAME=YOUR_CLOUD_NAME
API_KEY=YOUR_API_KEY
API_SECRET=YOUR_API_SECRET
MAIL_HOST=YOUR_SMTP_SERVER
MAIL_USER=YOUR_EMAIL_ADDRESS
MAIL_PASS=YOUR_EMAIL_PASSWORD
EXECUTION_API_URL=YOUR_EXECUTION_API_URL
```
#### 2. frontend .env file:

Create the `.env` file inside the `frontend_codebit/` directory. Add the following variables:

```bash
REACT_APP_BASE_URL="YOUR_SERVER LINK"

```
