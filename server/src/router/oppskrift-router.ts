import express, { request } from 'express';
import { oppskriftService } from '../service/oppskrift-services';

/**
 * Express router containing task methods.
 */
const router = express.Router();

router.get('/', (_request, response) => {
  oppskriftService
    .getAllRecipe()
    .then((rows) => response.send(rows))
    .catch((error) => response.status(500).send(error));
});

router.get('/recipe/:id', (_request, response) => {
  let id: number = parseInt(_request.params.id);

  oppskriftService
    .getRecipe(id)
    .then((rows) => {
      if (rows.length === 0) {
        response.status(404).send(`Oppskrift med id ${id} ikke funnet.`);
      } else {
        response.send(rows);
      }
    })
    .catch((error) => response.status(500).send(error));
});

router.post('/createrecipe', (request, response) => {
  const data = request.body;

 if(
    data.recipe.oppskrift_navn &&
    data.recipe.oppskrift_beskrivelse &&
    data.recipe.oppskrift_steg &&
    data.recipe.ant_pors &&
    data.recipe.kategori_id &&
    data.recipe.land_id != ''
  ){
    oppskriftService
      .createRecipe(data.recipe)
      .then((id) => {response.status(201).send({ id: id })})
      .catch((error) => {
        response.status(500).send(error);
      });
    }else response.status(400).send('Missing crutial information, fill in all the fields');
});

router.put('/update_recipe/:id', (request, response) => {
  oppskriftService
    .updateRecipe(request.body.recipe)
    .then(() =>{
      response.send()})
    .catch((error) => response.status(500).send('Ingen oppskrift ble oppdatert'));
});

router.put('/recipelike/:oppskrift_id', (req, res) => {
  oppskriftService
    .updateLiked(Number(req.params.oppskrift_id), req.body.liked)
    .then((_result) => res.send())
    .catch((error) => res.status(500).send(error));
});

router.delete('/deleterecipe/:id', (request, response) => {
  oppskriftService
    .deleteRecipe(Number(request.params.id))
    .then((_result) => response.send())
    .catch((error) => response.status(500).send(error));
});

export default router; 