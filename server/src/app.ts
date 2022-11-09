import express from 'express';
import iceboxRouter from './router/icebox-router';
import shoppingListRouter from './router/shoppingList-router';
import oppskriftRouter from './router/oppskrift-router';
import oppskrift_innholdRouter from './router/oppskrift_innhold-router';
import landRouter from './router/land-router';
import kategoriRouter from './router/kategori-router';
import ingrediensRouter from './router/ingrediens-router';


/**
 * Express application.
 */
const app = express();

app.use(express.json());

// Since API is not compatible with v1, API version is increased to v2
app.use('/api/v2', iceboxRouter);
app.use('/api/v2', shoppingListRouter);
app.use('/api/v2', oppskriftRouter);
app.use('/api/v2', oppskrift_innholdRouter);
app.use('/api/v2', landRouter);
app.use('/api/v2', kategoriRouter);
app.use('/api/v2', ingrediensRouter);

export default app;
