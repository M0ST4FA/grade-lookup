import e from 'express';
import studentRouter from './routers/studentRouter.js';

const app = e();
const dirname = import.meta.dirname;

app.use(e.static(`${dirname}/public/`));
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

export default app;
