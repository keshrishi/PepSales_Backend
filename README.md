PepSales Notification Service
A Node.js microservice for sending notifications via Email, SMS, and In-App channels using MongoDB, RabbitMQ, Nodemailer, and Twilio.

🚀 API Documentation
👉 View Full API Docs in Postman

🛠️ Setup Instructions
1. Clone the Repository & Install Dependencies
bash
git clone https://github.com/keshrishi/PepSales_Backend
cd PepSales_Backend
npm install
2. Environment Variables
The .env file is included in this submission as required for the assignment.

It contains all necessary credentials and configuration for running the project.

3. Start MongoDB and RabbitMQ
Ensure both services are running locally or are accessible.

4. Run the Application
Start the API server:

bash
npm run dev
Start the notification worker (in a separate terminal):

bash
npm run worker
⚡ Assumptions
MongoDB and RabbitMQ are accessible.

Credentials in .env are valid for Gmail and Twilio.

For Twilio trial accounts, only verified numbers can receive SMS.

📚 API Reference
Full API documentation with request/response examples:
👉 https://documenter.getpostman.com/view/40638998/2sB2qXj2Zb