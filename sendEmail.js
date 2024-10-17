const sdk = require('node-appwrite');
const nodemailer = require('nodemailer');

// Initialize Appwrite client
const client = new sdk.Client();

client
    .setEndpoint('https://cloud.appwrite.io/v1') // Replace with your Appwrite endpoint
    .setProject('6700b592001d71931ab9') // Replace with your project ID
    .setKey('standard_60d8a20948776a704fad854478d5b0a62caf085adab5c511a3eb38ba0f5a7dd6f2e96bec1d6fce072bc755631927fcfa2666432749132841137d81e971c8423932ef65a55005f3f6e603faac50edda40566141a5516c35a33c633ea701f30564b75f48c9afe8aaaee46f6970a9f890c75051d7798f54538d070319e36aea9c0c'); // Replace with your API key

const users = new sdk.Users(client);

module.exports = async function (req, res) {
    // Handle preflight (OPTIONS) requests
    if (req.method === 'OPTIONS') {
        return res.send('', 200, {
            'Access-Control-Allow-Origin': 'http://localhost:5173', // Update to your domain in production
            'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Appwrite-Project, X-Appwrite-User-Id',
        });
    }

    // Fetch all users from the Appwrite database
    try {
        const userList = await users.list(); // Get the list of users
        const emails = userList.users.map(user => user.email); // Extract user emails

        // Email configuration
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com', // Replace with your SMTP host
            port: 587, // Usually 587 for TLS
            secure: false, // Set to true if using SSL
            auth: {
                user: 'abhalbenny3@gmail.com', // Replace with your email
                pass: 'fdheyhfttmhizrcm', // Replace with your email password
            },
        });

        const mailOptions = {
            from: 'abhalbenny3@gmail.com', // Sender address
            to: emails.join(','), // List of recipients, joined as a string
            subject: req.body.subject, // Email subject from request
            text: req.body.message, // Email body from request
        };

        // Send email
        await transporter.sendMail(mailOptions);
        res.status(200).send({ message: 'Emails sent successfully!' });
    } catch (error) {
        console.error('Error sending emails:', error);
        res.status(500).send({ message: 'Error sending emails.' });
    }
};
