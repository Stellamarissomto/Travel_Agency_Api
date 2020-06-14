const mongoose = require('mongoose');


const connectDB = async() => {
    const conn = await mongoose.connect("mongodb+srv://tourapp:JomPoxyBMYUF5MmZ@cluster0-gmhf1.mongodb.net/tourapp?retryWrites=true&w=majority", {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true

    });

    console.log(`Database connected: ${conn.connection.host}`);
}

module.exports = connectDB;