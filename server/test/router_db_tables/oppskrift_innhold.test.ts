import axios from 'axios';
import pool from '../../src/mysql-pool';
import app from '../../src/app';
import {service, Ingredient, Recipe, Recipe_Content} from '../../src/services';

const ingredients: Ingredient[] = [
  {ingred_id: 1, ingred_navn: 'Chicken'},
  {ingred_id: 2, ingred_navn: 'Rice'},
  {ingred_id: 3, ingred_navn: 'Tomato'},
];

const recipes: Recipe[] = [
  {oppskrift_id: 1, oppskrift_navn: 'Chicken Rice', oppskrift_beskrivelse: 'Good chicken dish', oppskrift_steg: 'Cook rice and chicken', ant_pors: 4, bilde_adr: 'https://www.picture.com', kategori_id: 1, land_id: 1, ant_like: 0, liked: false},
  {oppskrift_id: 2, oppskrift_navn: 'Best Potato', oppskrift_beskrivelse: 'Good potato dish', oppskrift_steg: 'Cook rice and potato', ant_pors: 4, bilde_adr: 'https://www.potato.com', kategori_id: 2, land_id: 2, ant_like: 0, liked: false},
  {oppskrift_id: 3, oppskrift_navn: 'Best Tomato', oppskrift_beskrivelse: 'Good tomato dish', oppskrift_steg: 'Cook rice and tomato', ant_pors: 4, bilde_adr: 'https://www.tomato.com', kategori_id: 1, land_id: 1, ant_like: 0, liked: false},
];

const recipeContent: Recipe_Content[] = [
  {oppskrift_id: 1, ingred_id: 1, mengde: "1", maleenhet: 'stk'},
  {oppskrift_id: 1, ingred_id: 2, mengde: "1", maleenhet: 'stk'},
  {oppskrift_id: 1, ingred_id: 3, mengde: "1", maleenhet: 'stk'},
  {oppskrift_id: 2, ingred_id: 1, mengde: "1", maleenhet: 'stk'},
  {oppskrift_id: 3, ingred_id: 2, mengde: "1", maleenhet: 'stk'},
  {oppskrift_id: 3, ingred_id: 3, mengde: "1", maleenhet: 'stk'}, 
];

axios.defaults.baseURL = 'http://localhost:3001/api/v2';

let webServer: any;
beforeAll((done) => {
  // Use separate port for testing
  webServer = app.listen(3001, () => done());
});

beforeEach((done) => {
  // Delete all ingrediens, and reset id auto-increment start value
  pool.query('TRUNCATE TABLE oppskrift_innhold', (error) => {
    if (error) return done(error)

    service
      .createRecipeIngredient([recipeContent[0]])
      .then(() => service.createRecipeIngredient([recipeContent[1]]))
      .then(() => service.createRecipeIngredient([recipeContent[2]]))
      .then(() => service.createRecipeIngredient([recipeContent[3]]))   
      .then(() => service.createRecipeIngredient([recipeContent[4]]))
      .then(() => service.createRecipeIngredient([recipeContent[5]])) 
      .then(() => done());
  });
});

// Stop web server and close connection to MySQL server
afterAll((done) => {
  if (!webServer) return done(new Error());
  webServer.close(() => pool.end(() => done()));
});

describe('oppskrift_innhold GET', () => {
  test('Return all recipe content', (done) => {
    axios.get('/recipecontent').then((response) => {
      console.log(response.data);
      expect(response.status).toBe(200);
      expect(response.data).toEqual(recipeContent);
      done();
    });
  });

  test('Return recipe content by recipe id', (done) => {
    axios.get('/recipecontent/1').then((response) => {
      expect(response.status).toBe(200);
      expect(response.data).toEqual([recipeContent[0], recipeContent[1], recipeContent[2]]);
      done();
    });
  });

  test('Return recipe content by nonexisting id', (done) => {
    axios.get('/recipecontent/4').catch((error) => {
      expect(error.response.status).toBe(404);
      expect(error.response.data).toEqual(`Oppskrift med id 4 ikke funnet.`);
      done();
    });
  });

});

describe('oppskrift_innhold POST', () => {
  test('Create recipe content', (done) => {
    axios.post('/create_recipe_ingredient', {recipe_content: [{oppskrift_id: 2, ingred_id: 3, mengde: "1", maleenhet: 'stk'}]}).then((response) => {
      expect(response.status).toBe(201);
      expect(response.data).toEqual('Oppskrift innhold opprettet.');
      //expect(response.data).toEqual({oppskrift_id: 2, ingred_id: 3, mengde: "1", maleenhet: 'stk'});
      done();
    });
  });

  test('Create recipe content with missing data', (done) => {
    axios.post('/create_recipe_ingredient', {recipe_content:[{oppskrift_id: 4, ingred_id: 3, mengde: "1"}]}).catch((error) => {
      expect(error.response.status).toBe(500);
      done();
    });
  });
});

describe('oppskrift_innhold PUT', () => {
  test('Update recipe content', (done) => {
    axios.put('/update_recipe_ingredient', {recipeContent:[{oppskrift_id: 1, ingred_id: 1, mengde: "2", maleenhet: 'stk'}]}).then((response) => {
      expect(response.status).toBe(202);
      expect(response.data).toEqual('Oppskrift innhold oppdatert.');
      done();
    });
  });

  test('Update recipe content with missing data', (done) => {
    axios.put('/update_recipe_ingredient', {recipeContent:[{oppskrift_id: 1, ingred_id: 1, mengde: "2"}]}).catch((error) => {
      expect(error.response.status).toBe(500);
      done();
    });
  });

});

describe('oppskrift_innhold DELETE', () => {
  test('Delete recipe content', (done) => {
    axios.delete('/deleteingredient/1/1').then((response) => {
      expect(response.status).toBe(203);
      expect(response.data).toEqual('Oppskrift innhold slettet.');
      done();
    });
  });

  test('Delete recipe content with nonexisting id', (done) => {
    axios.delete('/deleteingredient/4/1').catch((error) => {
      expect(error.response.status).toBe(500);
      done();
    });
  });

});

