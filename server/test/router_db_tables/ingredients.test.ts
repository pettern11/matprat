import axios from 'axios';
import pool from '../../src/mysql-pool';
import app from '../../src/app';
import {service, Ingredient} from '../../src/services';

const ingredients: Ingredient[] = [
    {ingred_id: 1, ingred_navn: 'pølse' },
    {ingred_id: 2, ingred_navn: 'løk' },
    {ingred_id: 3, ingred_navn: 'eple' },
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
  pool.query('TRUNCATE TABLE ingrediens', (error) => {
    if (error) return done(error);

    // Create testTasks sequentially in order to set correct id, and call done() when finished
    service
      .createIngredient(ingredients[0].ingred_navn)
      .then(() => service.createIngredient(ingredients[1].ingred_navn)) 
      .then(() => service.createIngredient(ingredients[2].ingred_navn)) 
      .then(() => done()); // Call done() after ingredients[2] has been created
  });
});

// Stop web server and close connection to MySQL server
afterAll((done) => {
  if (!webServer) return done(new Error());
  webServer.close(() => pool.end(() => done()));
});



describe('Fetch ingredients (GET)', () => {
  test('Fetch all ingredients (200 OK)', (done) => {

    axios.get('/ingredient').then((response) => {
      expect(response.status).toEqual(200);
      expect(response.data).toEqual(ingredients);
      done();
    });
  });
  
});

describe('Create ingredient (POST)', () => {
  test('Create ingredient (201 Created)', (done) => {
    const ingredient = {ingred_navn: 'ost'};

    axios.post('/newingredient', ingredient).then((response) => {
      expect(response.status).toEqual(201);
      done();
    });
  });
  //create ingredient without name
  test('Create ingredient with missing attribute (400 Bad Request)', (done) => {
    const ingredient = {};

    axios.post('/newingredient', ingredient).catch((error) => {
      expect(error.response.status).toEqual(500);
      expect(error.response.data.sqlMessage).toEqual('Column \'ingred_navn\' cannot be null');
      done();
    });
  });

});



