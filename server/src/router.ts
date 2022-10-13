import express from 'express';
import { service } from './services';

/**
 * Express router containing task methods.
 */
const router = express.Router();

router.get('/', (_request, response) => {
  service
    .getAllRecipe()
    .then((rows) => response.send(rows))
    .catch((error) => response.status(500).send(error));
});

router.get('/newrecipe', (_request, response) => {
  service
    .getAllCountry()
    .then((rows) => response.send(rows))
    .catch((error) => response.status(500).send(error));
});
router.get('/newrecipe', (_request, response) => {
  service
    .getAllCategory()
    .then((rows) => response.send(rows))
    .catch((error) => response.status(500).send(error));
});

export default router;
