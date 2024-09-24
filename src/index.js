const express = require('express');
const rateLimit = require('express-rate-limit');
const httpProxy = require('http-proxy');

const { ServerConfig } = require('./config');
const apiRoutes = require('./routes');
const app = express();

const limiter = rateLimit({
    windowMs: 20 * 60 * 1000, // 20 minutes
    max: 3000, // Limit each IP to 3000 requests per window
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(limiter);
console.log(ServerConfig.FLIGHT_SERVICE);

// Create a proxy server
const proxy = httpProxy.createProxyServer({
    changeOrigin: true,
    timeout: 120000, // Increase proxy timeout to 2 minutes
    proxyTimeout: 120000, // Same for proxyTimeout
});

// Initial logging middleware
app.use((req, res, next) => {
    console.log(`Received ${req.method} request for ${req.url}`);
    console.log('Request headers:', req.headers);
    console.log('Request body:', req.body);
    next();
});

// Proxy middleware for flightsService
app.use('/flightsService', (req, res) => {
    console.log(`Proxying ${req.method} request to: ${ServerConfig.FLIGHT_SERVICE}${req.url}`);
    proxy.web(req, res, { target: ServerConfig.FLIGHT_SERVICE, pathRewrite: { '^/flightsService': '/' } }, (err) => {
        console.error('Proxy error:', err.message);
        console.error('Stack trace:', err.stack);
        res.status(500).send('Proxy error');
    });
});

// Proxy middleware for bookingService
app.use('/bookingService', (req, res) => {
    proxy.web(req, res, { target: ServerConfig.BOOKING_SERVICE }, (err) => {
        console.error('Proxy error:', err.message);
        console.error('Stack trace:', err.stack);
        res.status(500).send('Proxy error');
    });
});

app.use('/api', apiRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const server = app.listen(ServerConfig.PORT, async () => {
    console.log(`Successfully started the server on PORT: ${ServerConfig.PORT}`);
});

server.timeout = 120000; // Increase server timeout to 2 minutes
/**
 * user
 *  |
 *  v
 * localhost:3001 (API Gateway) localhost:4000/api/v1/bookings
 *  |
 *  v
 * localhost:3000/api/v1/flights
 */