const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const env = require('./config/env');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/error.middleware');
const { sendSuccess, sendError } = require('./utils/response');

// Import routes
const authRoutes = require('./routes/auth.routes');
const employeeRoutes = require('./routes/employee.routes');
const attendanceRoutes = require('./routes/attendance.routes');
const leaveRoutes = require('./routes/leave.routes');
const payrollRoutes = require('./routes/payroll.routes');
const workforceRoutes = require('./routes/workforce.routes');
const leaveImpactRoutes = require('./routes/leaveImpact.routes');
const copilotRoutes = require('./routes/copilot.routes');

const app = express();

// Middleware — allow the Vite dev origins; wildcard+credentials is invalid per spec
const allowedOrigins = [
  env.FRONTEND_URL,
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5173'
];
app.use(
  cors({
    origin(origin, callback) {
      // Allow same-origin/no-origin (curl, mobile apps, proxied requests)
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(null, true); // hackathon mode: permissive
    },
    credentials: true
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  return sendSuccess(res, {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'DayFlow Intelligent Workforce OS Backend'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/leave', leaveRoutes);
app.use('/api/payroll', payrollRoutes);
app.use('/api/workforce', workforceRoutes);
app.use('/api/leave-impact', leaveImpactRoutes);
app.use('/api/copilot', copilotRoutes);

// 404 Handler
app.use((req, res) => {
  return sendError(res, `Route ${req.method} ${req.originalUrl} not found.`, 'NOT_FOUND', 404);
});

// Global Error Handler
app.use(errorHandler);

// Start server
const startServer = async () => {
  await connectDB();

  const server = app.listen(env.PORT, () => {
    console.log(`[Server] DayFlow backend running on port ${env.PORT} in ${env.NODE_ENV} mode.`);
  });

  return server;
};

if (require.main === module) {
  startServer();
}

module.exports = app;
