import express, { request } from 'express';
import { kategoriService } from '../service/kategori-services';

/**
 * Express router containing task methods.
 */
const router = express.Router();

router.get('/category', (_request, response) => {
  kategoriService
    .getAllCategory()
    .then((rows) => response.send(rows))
    .catch((error) => response.status(500).send(error));
});

router.post('/newcategory', (request, response) => {
  const data = request.body.name;
  kategoriService
    .createCategory(data)
    .then(() => response.status(201).send())
    .catch((error) => response.status(500).send(error));
});

export default router; 