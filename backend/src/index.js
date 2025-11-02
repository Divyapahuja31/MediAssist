import express from 'express';
import cors from 'cors';
import { config } from './config/env.js';
import { connectDB, disconnectDB } from './config/db.js';
import { errorHandler } from './middlewares/error.middleware.js';


const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('MediAssist API is running');
});


app.use(errorHandler);

const startServer = async () => {
  await connectDB();

  const server = app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
  });

  // Graceful shutdown
  process.on('SIGINT', async () => {
    console.log('Shutting down server...');
    await disconnectDB();
    server.close(() => {
      console.log('Server closed');
      process.exit(0);
    });
  });
};

startServer(); 