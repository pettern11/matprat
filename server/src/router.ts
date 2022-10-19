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

router.post('/create_recipe_ingredient', (request, response) => {
  const data = request.body;
  console.log('tredje console log', data.recipe_content);
  service
    .createRecipeIngredient(data.recipe_content)
    .then((_result) => response.send())
    .catch((error) => response.status(500).send(error));
});

router.post('/createrecipe', (request, response) => {
  const data = request.body;
  console.log(data.recipe);
  if (
    data.recipe.oppskrift_navn &&
    data.recipe.oppskrift_beskrivelse &&
    data.recipe.oppskrift_steg &&
    data.recipe.ant_pors &&
    data.recipe.kategori_id &&
    data.recipe.land_id != ''
  )
    service
      .createRecipe(data.recipe)
      .then((id) => response.send({ id: id }))
      .catch((error) => response.status(500).send(error));
  else response.status(400).send('Missing crutial information, fill in all the fields');
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
router.post('/newcategory', (request, response) => {
  const data = request.body;
  service
    .createCategory(data.name)
    .then(() => response.send())
    .catch((error: any) => response.status(500).send(error));
});

router.put('/update_recipe_ingredient', (request, response) => {
  console.log(1);
  service
    .updateRecipeIngredient(request.body.recipeContent)
    .then(() => response.send())
    .catch((error) => response.status(500).send(error));
});
router.put('/update_recipe', (request, response) => {
  service
    .updateRecipe(request.body.recipe)
    .then(() => response.send())
    .catch((error) => response.status(500).send(error));
});
router.delete('/deleteingredient/:recipeid/:ingredid', (request, response) => {
  console.log(request.params.recipeid, request.params.ingredid);
  service
    .deleteIngredient(Number(request.params.recipeid), Number(request.params.ingredid))
    .then((_result) => response.send())
    .catch((error) => response.status(500).send(error));
});
router.delete('/deleterecipe/:id', (request, response) => {
  service
    .deleteRecipe(Number(request.params.id))
    .then((_result) => response.send())
    .catch((error) => response.status(500).send(error));
});
export default router;
