import express, { request } from 'express';
import { iceboxService } from '../service/icebox-services';

/**
 * Express router containing task methods.
 */
const router = express.Router();

router.get('/icebox', (_request, response) => {
  iceboxService
    .getAllIceboxIngredients()
    .then((rows) => response.send(rows))
    .catch((error) => response.status(500).send(error));
});

router.post('/addingredienttoicebox', (request, response) => {
  const data = request.body.selectedIceboxIngredient;

  iceboxService
    .addIngredientToIcebox(data)
    .then(() => response.status(201).send())
    .catch((error) => {
      if(error.errno == 1062){
      response.status(400).send('Ingredient already in icebox');
    } else {
      response.status(500).send(error)}});
});

router.delete('/deleteiceboxingredient/:ingred_id', (request, response) => {
  iceboxService
    .deleteIceboxIngredient(Number(request.params.ingred_id))
    .then((_result) => response.status(202).send())
    .catch((error) => {
      if(error.affectedRows == 0){ 
      response.status(400).send('Ingredient not in icebox');
    } else {
      response.status(500).send(error)}});
}); 

export default router;
