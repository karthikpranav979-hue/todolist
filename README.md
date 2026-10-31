# AI-Powered To-Do List Application

An interactive To-Do List application with an AI Task Assistant
that converts user goals into actionable tasks using Google's
Gemini API.

## Features

- Add and delete tasks
- Mark tasks as completed
- Automatically save tasks using LocalStorage
- Generate actionable tasks using Gemini AI
- Add individual AI-generated suggestions to your task list

## Technologies Used

Frontend:
- HTML
- CSS
- JavaScript
- Bootstrap

Backend:
- Node.js
- Express.js
- Google Gemini API

## Project Structure

- index.html - Application structure
- 2dolist.css - Styling
- 2dolist.js - Frontend functionality
- backend/server.js - AI API integration

## Running Locally

1. Clone the repository.
2. Install backend dependencies:

   cd backend
   npm install

3. Create a .env file inside backend:

   GEMINI_API_KEY=your_api_key

4. Start the backend:

   npm start

5. Open index.html using VS Code Live Server.

## AI Task Assistant

Users can enter a goal, receive AI-generated task suggestions,
and selectively add them to their To-Do List.
