Full-Stack Teacher & User Management Application
This is a full-stack web application built for a technical assessment. It features a CodeIgniter 4 backend providing a RESTful API with token-based authentication, and a ReactJS frontend for the user interface.

This project fulfills all the requirements of the assessment, including JWT authentication, a two-step registration process, and a dashboard that displays data from two separate, related tables in a tabbed view.

Technology Stack
Backend
Framework: CodeIgniter 4

Language: PHP 8.1+

Database: MySQL

Authentication: JSON Web Tokens (JWT)

Dependency Manager: Composer

Frontend
Library: ReactJS

Styling: CSS-in-JS (No external libraries)

Package Manager: npm

Core Features
JWT-Based Authentication: Secure user registration and login functionality. The server issues a token upon successful login, which is required to access protected routes.

Two-Step Registration: A user-friendly, multi-step form to collect user and teacher details separately, which are then saved to two related database tables in a single transaction.

Protected API Endpoints: The dashboard data endpoints are protected. Any request without a valid JWT in the Authorization header will be rejected.

Separate Data Tables: The dashboard features a clean, tabbed view to display data from the auth_user and teachers tables separately, as required by the assignment.

MySQL Database: Uses a MySQL database with a 1-to-1 relationship between the auth_user and teachers tables, linked by a foreign key.

Modern UI/UX: A clean, responsive, and creative user interface built with React, featuring animations and a polished design.

API Endpoints
Method

Endpoint

Description

Authentication

POST

/api/register

Creates a new user and teacher record.

None

POST

/api/login

Authenticates a user and returns a JWT.

None

GET

/api/users

Fetches all records from auth_user.

Required

GET

/api/teachers

Fetches all records from teachers.

Required

Project Structure
/
├── backend/              # CodeIgniter 4 API
├── frontend/             # ReactJS Application
└── teacher_db.sql        # Database export file

Getting Started: A Detailed Setup Guide
To run this project on your local machine, please follow the steps below carefully.

Prerequisites
Before you begin, ensure you have the following installed:

XAMPP: Provides Apache, MySQL, and PHP. Download XAMPP

Node.js: Required to run the React frontend. Download Node.js

Composer: The dependency manager for PHP. Download Composer

Git: For version control. Download Git

1. Backend Setup (CodeIgniter API)
First, we will set up and run the backend server.

Step 1.1: Navigate to the Backend Directory
Open your terminal or command prompt and navigate into the backend folder of the project.

cd backend

Step 1.2: Enable Required PHP Extensions (Important)
CodeIgniter and its dependencies require certain PHP extensions to be enabled.

Open your XAMPP Control Panel.

On the Apache row, click the Config button and select PHP (php.ini).

In the text file that opens, search for the following lines and remove the semicolon (;) from the beginning of each:

;extension=intl
;extension=zip

Save the php.ini file and restart Apache from the XAMPP Control Panel.

Step 1.3: Install PHP Dependencies
Now, run the following command to install all the necessary PHP libraries.

composer install

Step 1.4: Configure Your Environment

In the backend folder, find the file named env and rename it to .env.

Open the .env file and update it with your MySQL details. It should look something like this (your password may be blank):

database.default.hostname = localhost
database.default.database = teacher_db
database.default.username = root
database.default.password = 
database.default.DBDriver = MySQLi
database.default.port = 3306 

Add the following line to the end of the file for token security:

JWT_SECRET = your-secret-key-here

Step 1.5: Set Up the Database

Start the Apache and MySQL modules from your XAMPP Control Panel.

Go to http://localhost/phpmyadmin in your browser.

Create a new database and name it teacher_db.

Click on the newly created database, go to the Import tab, and import the teacher_db.sql file from the project's root folder.

Step 1.6: Start the Backend Server

php spark serve

The API will now be running at http://localhost:8080. Keep this terminal open.

2. Frontend Setup (React App)
Open a new, separate terminal for the frontend setup.

Step 2.1: Navigate to the Frontend Directory

cd frontend

Step 2.2: Install Node.js Dependencies

npm install

Step 2.3: Start the React Application

npm start
