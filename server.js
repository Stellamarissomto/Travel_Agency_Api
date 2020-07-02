const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const connectDB = require("./config/db");
const AppError = require("./util/appError");
const globalErrorHandler = require("./controllers/errorController");

// load dotenv file 
dotenv.config({path: './config/config.env'});

// route files
const tourRoute = require("./routes/tourroutes");
const userRoute = require("./routes/userroutes");


// connection to db
connectDB();

const app = express(); 
app.use(express.json()); // body parser
app.use(express.urlencoded({ extended: false }));


// adding morgan logger
if (process.env.NODE_ENV ==='development') {
    app.use(morgan('dev'));
}


// mount routes
app.use('/api/v1/tour', tourRoute);
//app.use('api/v1/users', userRoute);

// Middleware for wrong route 

app.all('*', (req, res, next) => {
    
    next( new AppError(`can't find ${req.originalUrl} in the server`, 404))
});

// error handling middleware

app.use(globalErrorHandler);

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
