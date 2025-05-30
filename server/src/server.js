import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import connectDb from './config/database.js';
import productRouter from './routes/products.js';
import orderRouter from './routes/orders.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDb();

const app = express();

// Security middleware
// app.use(helmet());

// Rate limiting

const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW) * 60 * 1000,
  limit: parseInt(process.env.RATE_LIMIT_MAX),
  message: {
    error: 'Too many requests from this IP, please try again later.',
  },
});
app.use(limiter);

// cors setup
app.use(
  cors({
    origin: process.env.FRONTEND_URL
  })
);
console.log(process.env.FRONTEND_URL)
// app.use(cors());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.get('/', (req, res) => {
  res.send('Hello world! Server is up.');
});

app.get('/api/test', (req, res) => {
  res.send('Request successful');
});

app.all('/{*splat}', (req, res, next) => {
  console.log(`Received a ${req.method} request to ${req.originalUrl}`);
  next();
});

app.use('/product', productRouter);
app.use('/order', orderRouter);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
