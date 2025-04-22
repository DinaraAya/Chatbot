# ChatbotApp

## Overview

This application provides a chat interface designed to handle customer support queries, specifically related to booking management (status checks, cancellations, refunds) and issue reporting (payments, room/service complaints). It leverages a BERT model run via a Python script for understanding user intent from free-text input and provides specific flows and FAQ pages for common issues.

## Features

* **Interactive Chat Interface:** User-friendly chat window built with React.
* **Intent Prediction:** Uses a BERT model to understand user intent from text input.
* **Predefined Flows:** Handles specific tasks like:
    * Checking booking status
    * Cancelling bookings
    * Requesting refunds
    * Reporting payment issues
    * Reporting room/service issues
* **FAQ Pages:** Provides dedicated pages for detailed information on various topics (Payments, Refunds, Complaints, etc.).
* **Backend API:** Node.js/Express server handles API requests for booking status and intent prediction.
* **Database Integration:** Connects to MongoDB Atlas to retrieve booking information.

## Installation and Setup

1.Download the zip file from github and extract it (Note: Do not clone repository, as it has large file that is not cloneable)

#1a. Open a terminal of your choice 

2. Navigate into the project directory if not in it already
cd Chatbot-main

3. Server Setup
3a. Navigate to the server directory
cd server

3b. Install Node.js dependencies
npm install

#3c. Install transformers (in the same server directory)
pip install torch transformers

4. Client Setup
4a. Navigate to the client directory (from the server directory)
cd ../client
(Or from the project root: cd Chatbot-main/client)

4b. Install Node.js dependencies
npm install

#5. CORS setup
#5a. Navigate into the main project directory cd Chatbot-main (cd..)

#5b. Install cors package
npm install cors --save

–Setup is complete–

## Running the Chatbot App

#6. Navigate to the server directory (if not already there)
cd path/to/your/Chatbot-main/server

#6a. Start the Node.js server
node index.js
Server should now be running, typically on port 3001

#6b. Open a separate terminal, without closing the first one

#6c. Navigate to the client directory from another terminal (if not already there)
cd path/to/your/Chatbot-main/client

#6d. Start the Vite development server
npm run dev
Client should now be running, typically on  http://localhost:5173/. Access it through your browser of choice:)
