import express, { request } from 'express';
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
    .then((rows) => {
      if (rows.length === 0) {
        response.status(404).send(`Oppskrift med id ${id} ikke funnet.`);
      } else {
        response.send(rows);
      }
    })
    .catch((error) => response.status(500).send(error));
});
router.get('/recipecontent/:id', (_request, response) => {
  let id: number = parseInt(_request.params.id);

  service
    .getRecipeContent(id)
    .then((rows) =>{
      if(rows.length === 0){
        response.status(404).send(`Oppskrift med id ${id} ikke funnet.`); 
      } else {
      response.send(rows)}
    })
    .catch((error) => response.status(500).send(error));
});
router.get('/country', (_request, response) => {
  service
    .getAllCountry()
    .then((rows) => response.status(200).send(rows))
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
router.get('/icebox', (_request, response) => {
  service
    .getAllIceboxIngredients()
    .then((rows) => response.send(rows))
    .catch((error) => response.status(500).send(error));
});
router.get('/recipecontent', (_request, response) => {
  service
    .getAllRecipeContent()
    .then((rows) => response.send(rows))
    .catch((error) => response.status(500).send(error));
});
router.get('/shoppinglist', (_request, response) => {
  
  service
    .getShoppingList()
    .then((rows) => response.send(rows))
    .catch((error) => response.status(500).send(error));
});


router.post('/create_recipe_ingredient', (request, response) => {
  const data = request.body;
  service
    .createRecipeIngredient(data.recipe_content)
    .then((_result) => response.status(201).send('Oppskrift innhold opprettet.'))
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
    service
      .createRecipe(data.recipe)
      .then((id) => {response.status(201).send({ id: id })})
      .catch((error) => {
        response.status(500).send(error);
      });
    }else response.status(400).send('Missing crutial information, fill in all the fields');
});
router.post('/addingredient', (request, response) => {
  const data = request.body.ingredient;
  console.log(data);
  if(data.ingred_id == '' || data.ingred_id == null
  || data.mengde == '' || data.mengde == null
  || data.maleenhet == '' || data.maleenhet == null){
    response.status(400).send('Missing crutial information, fill in all the fields');
  } else {
  service
    .addIngredientShoppinglist(data)
    .then(() => response.send())
    .catch((error) => response.status(500).send(error));
}});
router.post('/addingredienttoicebox', (request, response) => {
  const data = request.body.selectedIceboxIngredient;

  service
    .addIngredientToIcebox(data)
    .then(() => response.status(201).send())
    .catch((error) => {
      if(error.errno == 1062){
      response.status(400).send('Ingredient already in icebox');
    } else {
      response.status(500).send(error)}});
});
router.post('/newingredient', (request, response) => {
  const data = request.body.ingred_navn;
  service
    .createIngredient(data)
    .then(() => response.status(201).send())
    .catch((error) => response.status(500).send(error));
});
router.post('/newcountry', (request, response) => {
  const data = request.body.name;
  console.log(data);
  service
    .createCountry(data)
    .then(() => response.status(201).send())
    .catch((error) => response.status(500).send(error));
});
router.post('/newcategory', (request, response) => {
  const data = request.body.name;
  service
    .createCategory(data)
    .then(() => response.status(201).send())
    .catch((error) => response.status(500).send(error));
});

router.put('/update_recipe_ingredient', (request, response) => {
  const data = request.body;
  console.log(data)
  service
    .updateRecipeIngredient(request.body.recipeContent)
    .then(() =>{console.log(response); response.status(202).send('Oppskrift innhold oppdatert.')})
    .catch((error) => response.status(500).send(error));
});
router.put('/updateingredient', (request, response) => {
  const data = request.body.ingredient;
  console.log(data)

  service.updateIngredientShoppinglist(data)
    .then(() => response.send())
    .catch((error) => response.status(500).send(error));
});
router.put('/update_recipe/:id', (request, response) => {
  service
    .updateRecipe(request.body.recipe)
    .then(() =>{
      response.send()})
    .catch((error) => response.status(500).send('Ingen oppskrift ble oppdatert'));
});
router.put('/recipelike/:oppskrift_id', (req, res) => {
  service
    .updateLiked(Number(req.params.oppskrift_id), req.body.liked)
    .then((_result) => res.send())
    .catch((error) => res.status(500).send(error));
});


router.delete('/deleteingredient/:recipeid/:ingredid', (request, response) => {
  service
    .deleteIngredient(Number(request.params.recipeid), Number(request.params.ingredid))
    .then((_result) =>{console.log(_result); response.status(203).send('Oppskrift innhold slettet.')})
    .catch((error) => response.status(500).send(error));
});
router.delete('/deleteingredientshoppinglist/:id', (request, response) => {
  service
    .deleteIngredientShoppinglist(Number(request.params.id))
    .then((_result) => response.send())
    .catch((error) => response.status(500).send(error));
});
router.delete('/deleteiceboxingredient/:ingred_id', (request, response) => {
  service
    .deleteIceboxIngredient(Number(request.params.ingred_id))
    .then((_result) => response.status(202).send())
    .catch((error) => {
      if(error.affectedRows == 0){ 
      response.status(400).send('Ingredient not in icebox');
    } else {
      response.status(500).send(error)}});
});
router.delete('/deleteallshoppinglist', (request, response) => {
  service
    .deleteAllShoppinglist()
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
