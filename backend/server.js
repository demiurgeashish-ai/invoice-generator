require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const connectDB = require('./config/db');
const corsOptions = require('./config/corsOptions');

// Routes
const authRoute = require('./routes/authRoute');
const companyRoute = require('./routes/companyRoute');
const clientRoute = require('./routes/clientRoute');
const invoiceRoute = require('./routes/invoiceRoute');
const businessRoute = require('./routes/businessRoute');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to DB
connectDB();

// Passport config
require('./config/passport')(passport);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));

// Session setup
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    }
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get('/', (req, res) => {
  res.send('Invoice Generator API is running! Please visit the frontend application on port 5173.');
});
app.use('/', companyRoute);
app.use('/auth', authRoute);
app.use('/api/business', businessRoute);
app.use('/api/clients', clientRoute);
app.use('/api/invoices', invoiceRoute);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
