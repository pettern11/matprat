import express, { request } from 'express';
import { ingrediensService } from '../service/ingrediens-services';

/**
 * Express router containing task methods.
 */
const router = express.Router();

router.get('/ingredient', (_request, response) => {
  ingrediensService
    .getAllIngredient()
    .then((rows) => response.send(rows))
    .catch((error) => response.status(500).send(error));
});

router.post('/newingredient', (request, response) => {
  const data = request.body.name
  ingrediensService
    .createIngredient(data)
    .then(() => response.status(201).send())
    .catch((error) => response.status(500).send(error));
});



export default router;