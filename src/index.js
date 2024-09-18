const express = require('express');

const { ServerConfig } = require('./config');
const apiRoutes = require('./routes');

const app = express();

// Middleware to parse JSON request bodies

app.use(express.json());

//urlencoded

app.use(express.urlencoded({ extended: true }));


app.use('/api', apiRoutes);

app.listen(ServerConfig.PORT, () => {
    console.log(`Successfully started the server on PORT : ${ServerConfig.PORT}`);
});
