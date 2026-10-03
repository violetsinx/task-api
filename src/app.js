import express from 'express';
import routes from './routes/index.js';
import { errorHandler } from './middlewares/error-handler.js';

const app = express();

app.use(express.json());
app.use(routes);
app.use((req, res) => res.status(404).json({ error: 'Not found' }));
app.use(errorHandler);

export default app;
