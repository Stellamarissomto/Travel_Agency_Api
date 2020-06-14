const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const connectDB = require("./config/db");

// load dotenv file 
dotenv.config({path: './config/config.env'});

// route files
const tourRoute = require("./routes/tourroutes");
const userRoute = require("./routes/userroutes");



const app = express(); 
app.use(express.json()); // body parser

// connection to db
connectDB();

// adding morgan logger
if (process.env.NODE_ENV ==='development') {
    app.use(morgan('dev'));
}


// mount routes
//app.use('/api/v1/tour', tourRoute);
//app.use('api/v1/users', userRoute);

// setting up the server
const PORT = process.env.PORT || 4000

const server = app.listen(PORT, 
    console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT}`) );


    // handle unhanled promise rejections
process.on('unhandledRejection', (err, Promise) => {
    console.log(`Error: ${err.message}`);
    // close server 

    server.close(() => process.exit(1));
});
