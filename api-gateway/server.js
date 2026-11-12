
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

dotenv.config();

const app = express();

app.use(cors());

app.get('/', (req, res) => {
    res.json({
        message: 'Student Management API Gateway is running'
    });
});

// Registration Microservice
app.use('/api/register',
    createProxyMiddleware({
        target: process.env.REGISTRATION_SERVICE_URL,
        changeOrigin: true,
        pathRewrite: {
            '^/': '/register'
        }
    })
);

// Update Student Microservice
app.use('/api/students',
    createProxyMiddleware({
        target: process.env.UPDATE_SERVICE_URL,
        changeOrigin: true,
        pathRewrite: {
            '^/': '/students/'
        }
    })
);

// Start API Gateway
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`);
});
