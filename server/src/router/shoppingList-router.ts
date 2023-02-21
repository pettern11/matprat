import express, { request } from 'express';
import { shoppingListService } from '../service/shoppingList-services';

/**
 * Express router containing task methods.
 */
const router = express.Router();

router.get('/shoppinglist', (_request, response) => {
  
  shoppingListService
    .getShoppingList()
    .then((rows) => response.send(rows))
    .catch((error) => response.status(500).send(error));
});

router.post('/addingredient', (request, response) => {
  const data = request.body.ingredient;
  if(data.ingred_id == '' || data.ingred_id == null
   || data.mengde == null
   || data.maleenhet == null){
    response.status(400).send('Missing crutial information, fill in all the fields');
  } else {
    shoppingListService
    .addIngredientShoppinglist(data)
    .then(() => response.send())
    .catch((error) => response.status(500).send(error));
}});  

router.put('/updateingredient', (request, response) => {
  const data = request.body.ingredient;
  shoppingListService
  .updateIngredientShoppinglist(data)
    .then(() => response.send())
    .catch((error) => response.status(500).send(error));
});

router.delete('/deleteingredientshoppinglist/:id', (request, response) => {
  shoppingListService
    .deleteIngredientShoppinglist(Number(request.params.id))
    .then((_result) => response.send())
    .catch((error) => response.status(500).send(error));
});

router.delete('/deleteallshoppinglist', (request, response) => {
  shoppingListService
    .deleteAllShoppinglist()
    .then((_result) => response.send())
    .catch((error) => response.status(500).send(error));
});

export default router; 