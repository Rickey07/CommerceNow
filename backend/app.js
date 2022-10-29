require('dotenv').config();

const mongoose = require('mongoose');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoutes = require('../backend/routes/auth');
const userRoutes = require('../backend/routes/user');
const categoryRoutes = require('../backend/routes/category');
const productRoutes = require('./routes/product');
const orderRoutes = require('./routes/order')

// DB Connection
mongoose.connect(process.env.DB_HOST,{useNewUrlParser:true})
.then(() => console.log(`Successfully connected to database`))
.catch((error) => console.log(error))

// App Middlewares
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser())

// Routes
app.use('/api' , authRoutes)
app.use('/api', userRoutes)
app.use('/api',categoryRoutes)
app.use('/api',productRoutes)
app.use('/api',orderRoutes)

// Port
const port = process.env.PORT || 5000;

app.listen(port,() => {
    console.log(`app is running at ${port}`)
})