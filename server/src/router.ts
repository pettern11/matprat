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
router.get('/recipe/:id', (_request, response) => {
  let id: number = parseInt(_request.params.id);

  service
    .getRecipe(id)
    .then((rows) => response.send(rows))
    .catch((error) => response.status(500).send(error)); 
});

router.get('/recipecontent/:id', (_request, response) => {
  let id: number = parseInt(_request.params.id);

  service
    .getRecipeContent(id)
    .then((rows) => response.send(rows))
    .catch((error) => response.status(500).send(error));
});

 

router.get('/country', (_request, response) => {
  service
    .getAllCountry()
    .then((rows) => response.send(rows))
    .catch((error) => response.status(500).send(error));
});
router.get('/category', (_request, response) => {
  service
    .getAllCategory()
    .then((rows) => response.send(rows))
    .catch((error) => response.status(500).send(error));
});
router.get('/ingredient', (_request, response) => {
  service
    .getAllIngredient()
    .then((rows) => response.send(rows))
    .catch((error) => response.status(500).send(error));
});
router.post('/newingredient', (request, response) => {
  const data = request.body;
  service
    .createIngredient(data.name)
    .then(() => response.send())
    .catch((error: any) => response.status(500).send(error));
});
router.post('/newcountry', (request, response) => {
  const data = request.body;
  service
    .createCountry(data.name)
    .then(() => response.send())
    .catch((error: any) => response.status(500).send(error));
});
export default router;
