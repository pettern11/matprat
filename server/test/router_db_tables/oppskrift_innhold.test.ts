import axios from 'axios';
import pool from '../../src/mysql-pool';
import app from '../../src/app';
import {oppskrift_innholdService, Recipe_Content} from '../../src/service/oppskrift_innhold-services';


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

    oppskrift_innholdService
      .createRecipeIngredient([recipeContent[0]])
      .then(() => oppskrift_innholdService.createRecipeIngredient([recipeContent[1]]))
      .then(() => oppskrift_innholdService.createRecipeIngredient([recipeContent[2]]))
      .then(() => oppskrift_innholdService.createRecipeIngredient([recipeContent[3]]))   
      .then(() => oppskrift_innholdService.createRecipeIngredient([recipeContent[4]]))
      .then(() => oppskrift_innholdService.createRecipeIngredient([recipeContent[5]])) 
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

  test('Fetch recipe content with invalid id', (done) => {
    axios.get('/recipecontent/heidu').catch((error) => {
      expect(error.response.status).toBe(500);
      done();
    });
  });

}); 

describe('Lag ny oppskrift_innhold POST', () => {
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

describe('Oppdater oppskrift_innhold (ingredienser til oppskrift) PUT', () => {
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

  test('Delete recipe content with invalid id', (done) => {
    axios.delete('/deleteingredient/heidu/1').catch((error) => {
      expect(error.response.status).toBe(500);
      done();
    });
  });

});

