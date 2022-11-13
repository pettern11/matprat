import express, { request } from 'express';
import { oppskrift_innholdService } from '../service/oppskrift_innhold-services';

/**
 * Express router containing task methods.
 */
const router = express.Router();

router.get('/recipecontent/:id', (_request, response) => {
  let id: number = parseInt(_request.params.id);

  oppskrift_innholdService
    .getRecipeContent(id)
    .then((rows) =>{
      if(rows.length === 0){
        response.status(404).send(`Oppskrift med id ${id} ikke funnet.`); 
      } else {
      response.send(rows)}
    })
    .catch((error) => response.status(500).send(error));
});

router.get('/recipecontent', (_request, response) => {
  oppskrift_innholdService
    .getAllRecipeContent()
    .then((rows) => response.send(rows))
    .catch((error) => response.status(500).send(error));
});

router.post('/create_recipe_ingredient', (request, response) => {
  const data = request.body;
  oppskrift_innholdService
    .createRecipeIngredient(data.recipe_content)
    .then((_result) => response.status(201).send('Oppskrift innhold opprettet.'))
    .catch((error) => response.status(500).send(error));
});

router.put('/update_recipe_ingredient', (request, response) => {
  const data = request.body;
  oppskrift_innholdService
    .updateRecipeIngredient(request.body.recipeContent)
    .then(() =>{response.status(202).send('Oppskrift innhold oppdatert.')})
    .catch((error) => response.status(500).send(error));
});

router.delete('/deleteingredient/:recipeid/:ingredid', (request, response) => {
  oppskrift_innholdService
    .deleteIngredient(Number(request.params.recipeid), Number(request.params.ingredid))
    .then((_result) =>{response.status(203).send('Oppskrift innhold slettet.')})
    .catch((error) => response.status(500).send(error));
});

export default router; 