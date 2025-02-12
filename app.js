import e from 'express';
import studentRouter from './routers/studentRouter.js';
import path from 'path';

const app = e();

const staticDir = path.join(process.cwd(), 'public');

app.use(e.static(staticDir));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all domains
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS',
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200); // Handle preflight requests
  }

  next();
});
app.use(e.json());
app.use('/students/', studentRouter);

app.all('*', function (req, res, next) {
  res.status(404).json({
    status: 'fail',
    message: `Cannot find ${req.method} ${req.originalUrl} on this server!`,
  });
});

export default app;
