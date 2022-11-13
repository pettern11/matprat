import axios from 'axios';
import pool from '../../src/mysql-pool';
import app from '../../src/app';
import {shoppingListService, IngredientToShoppinglist} from '../../src/service/shoppingList-services';

const handleliste: IngredientToShoppinglist[] = [
    {ingred_id: 1, mengde: "1", maleenhet: 'stk' },
    {ingred_id: 2, mengde: "1", maleenhet: 'stk' },
    {ingred_id: 3, mengde: "1", maleenhet: 'stk' },
];

// Since API is not compatible with v1, API version is increased to v2
axios.defaults.baseURL = 'http://localhost:3001/api/v2';

let webServer: any;
beforeAll((done) => {
  // Use separate port for testing
  webServer = app.listen(3001, () => done());
});

beforeEach((done) => {
  // Delete all tasks, and reset id auto-increment start value
  pool.query('TRUNCATE TABLE handleliste', (error) => {
    if (error) return done(error);

    // Create testTasks sequentially in order to set correct id, and call done() when finished
    shoppingListService
      .addIngredientShoppinglist(handleliste[0])
      .then(() => shoppingListService.addIngredientShoppinglist(handleliste[1])) // Create testTask[1] after testTask[0] has been created
      .then(() => shoppingListService.addIngredientShoppinglist(handleliste[2])) // Create testTask[2] after testTask[1] has been created
      .then(() => done()); // Call done() after testTask[2] has been created
  });
});

// Stop web server and close connection to MySQL server
afterAll((done) => {
  if (!webServer) return done(new Error());
  webServer.close(() => pool.end(() => done()));
});



describe('Fetch shoppinglist items (GET)', () => {
  test('Fetch all shoppinglist items (200 OK)', (done) => {

    const handlelisteexpect: any = [
      {id: 1, ingred_id: 1, mengde: "1", maleenhet: 'stk' },
      {id: 2, ingred_id: 2, mengde: "1", maleenhet: 'stk' },
      {id: 3, ingred_id: 3, mengde: "1", maleenhet: 'stk' },
    ];

    axios.get('/shoppinglist').then((response) => {
      expect(response.status).toEqual(200);
      expect(response.data).toEqual(handlelisteexpect);
      done();
    });
  });
  
});

describe('Add ingredient to shoppinglist (POST)', () => {
  test('Add ingredient to shoppinglist (200 OK)', (done) => {
    axios.post('/addingredient', {ingredient: {ingred_id: 4, mengde: "5", maleenhet: 'pølser' }}).then((response) => {
      
      expect(response.status).toEqual(200);
      done();
    });
  });
  test('Add ingredient to shoppinglist invalid id', (done) => {
    axios.post('/addingredient', {ingredient: {ingred_id: "pølse", mengde: "5", maleenhet: 'pølser' }}).catch((error) => {
      
      expect(error.response.status).toEqual(500);
      done();
    });
  });

  test('Missing maleenhet (400 Bad Request)', (done) => {
    axios.post('/addingredient', {ingredient: {ingred_id: 4, mengde: "5"}}).catch((error) => {
      expect(error.response.data).toEqual('Missing crutial information, fill in all the fields');
      expect(error.response.status).toEqual(400);
      //expect(response.statusText).toEqual('Bad Request');
      done();
    });
  });
});


describe('Delete from shoppinglist (DELETE)', () => {
  //delete ingredient from shoppinglist /deleteingredientshoppinglist/:id
  test('Delete ingredient from shoppinglist (200 OK)', (done) => {
    axios.delete('/deleteingredientshoppinglist/2').then((response) => {
      expect(response.status).toEqual(200);
      done();
    });
  });

    test('Delete ingredient from shoppinglist invalid id', (done) => {
      axios.delete('/deleteingredientshoppinglist/heid').catch((error) => {
        expect(error.response.status).toEqual(500);
        done();
      });
    });

  //delete ingredient from shoppinglist with wrong id /deleteingredientshoppinglist/:id
  test('Delete non-existing ingredient from shoppinglist (500 Not Found)', (done) => {
    axios.delete('/deleteingredientshoppinglist/4').catch((error) => {
      expect(error.response.status).toEqual(500);
      done();
    });
  });

  //delete all ingredients from shooopinglist /deleteallshoppinglist
  test('Delete all ingredients from shoppinglist (200 OK)', (done) => {
    axios.delete('/deleteallshoppinglist').then((response) => {
      expect(response.status).toEqual(200);
      done();
    });
  });


});

describe('Update ingredient in shoppinglist (PUT)', () => {
  test('Update ingredient in shoppinglist (200 OK)', (done) => {
    axios.put('/updateingredient', {ingredient: {id:3, ingred_id: 4, mengde: "5", maleenhet: 'pølser' }}).then((response) => {
      expect(response.status).toEqual(200);
      done();
    });
  });

  test('Update non-existing ingredient in shoppinglist (500 Not Found)', (done) => {
    axios.put('/updateingredient', {ingredient: {id: 4, ingred_id: 4, mengde: "5", maleenhet: 'pølser' }}).catch((error) => {
      expect(error.response.status).toEqual(500);
      done();
    });
  });

  test('Update ingredient with invalid id', (done) => {
    axios.put('/updateingredient', {ingredient: {id: 'a', ingred_id: 4, mengde: "5", maleenhet: 'pølser' }}).catch((error) => {
      expect(error.response.status).toEqual(500);
      done();
    });
  });

  test('Update ingredient with missing maleenhet', (done) => {
    axios.put('/updateingredient', {ingredient: {id: 3, ingred_id: 4, mengde: "5"}}).catch((error) => {
      expect(error.response.status).toEqual(500);
      done();
    });
  });
}); 



