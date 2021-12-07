import express, { Application, Router } from 'express';
import router from './routing';

// initialize the application
const app: Application = express();

// initialize the application routes
app.use(router);

export default app;