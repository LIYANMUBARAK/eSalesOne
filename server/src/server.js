import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import connectDb from './config/database.js';
import productRouter from './routes/products.js';
// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDb();

const app = express();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: (process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000, // 15 minutes
  max: process.env.RATE_LIMIT_MAX || 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
  },
});
app.use(limiter);

// CORS configuration


app.use(cors()); 
// app.use(
//   cors({
//     origin: process.env.FRONTEND_URL || 'http://localhost:3000',
//     credentials: true,
//   })
// );

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware

// if (process.env.NODE_ENV === 'development') {
//   app.use(morgan('dev'));
// }

// Routes


// // Health check endpoint
// app.get('/api/health', (req, res) => {
//   res.status(200).json({
//     success: true,
//     message: 'ESalesOne API is running!',
//     timestamp: new Date().toISOString(),
//     environment: process.env.NODE_ENV,
//   });
// });

// wildcard route handler
// app.use('(.*)', (req, res) => {
//   res.status(404).json({
//     success: false,
//     message: `Route ${req.originalUrl} not found`,
//   });
// });

// Error handling middleware (should be last)
// app.use(errorHandler);

app.get('/', (req, res) => {
  res.send('Hello world! Server is up.');
});

app.use('/product',productRouter)

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle SIGTERM
// process.on('SIGTERM', () => {
//   console.log('SIGTERM received. Shutting down gracefully...');
//   server.close(() => {
//     console.log('Process terminated');
//   });
// });


