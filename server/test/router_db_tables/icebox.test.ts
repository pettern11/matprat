import axios from 'axios';
import pool from '../../src/mysql-pool';
import app from '../../src/app';
import {iceboxService, IceboxIngredient} from '../../src/service/icebox-services';

const icebox: IceboxIngredient[] = [
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
  pool.query('TRUNCATE TABLE icebox', (error) => {
    if (error) return done(error);

    // Create testTasks sequentially in order to set correct id, and call done() when finished
    iceboxService
      .addIngredientToIcebox(icebox[0])
      .then(() => iceboxService.addIngredientToIcebox(icebox[1]))
      .then(() => iceboxService.addIngredientToIcebox(icebox[2]))
      .then(() => done()); // Call done() after kategori[2] has been created
  });
});

// Stop web server and close connection to MySQL server
afterAll((done) => {
  if (!webServer) return done(new Error());
  webServer.close(() => pool.end(() => done()));
});

describe('Fetch icebox (GET)', () => {
  test('Fetch all icebox (200 OK)', (done) => {

    axios.get('/icebox').then((response) => {
      expect(response.status).toEqual(200);
      expect(response.data).toEqual(icebox);
      done();
    });
  });

});

describe('Create icebox (POST)', () => {
  test('Create icebox (201 Created)', (done) => {
    const icebox = {selectedIceboxIngredient: {ingred_id: 4, ingred_navn: 'ketchup' }};  

    axios.post('/addingredienttoicebox', icebox).then((response) => {
      expect(response.status).toEqual(201);
      done();
    });
  });
  test('Create already existing id icebox item', (done) => {
    const icebox = {selectedIceboxIngredient: {ingred_id: 1, ingred_navn: 'pølse' }};  

    axios.post('/addingredienttoicebox', icebox).catch((error) => {
      expect(error.response.status).toEqual(400);
      expect(error.response.data).toEqual('Ingredient already in icebox');
      done();
    });
  });

  test('Create icebox item with missing id', (done) => {
    const icebox = {selectedIceboxIngredient: {ingred_navn: 'ketchup' }};  

    axios.post('/addingredienttoicebox', icebox).catch((error) => {
      expect(error.response.status).toEqual(500);
      done();
    });
  });
  
});

describe('Delete icebox item (DELETE)', () => {
  test('Delete icebox item (202 OK)', (done) => {
    axios.delete('/deleteiceboxingredient/1').then((response) => {
      expect(response.status).toEqual(202);
      done();
    });
  });

  test('Delete non-existing icebox item', (done) => {
    axios.delete('/deleteiceboxingredient/4',).catch((error) => {
      expect(error.response.status).toEqual(400);
      expect(error.response.data).toEqual('Ingredient not in icebox');
      done();
    });
  });

  test('Delete icebox item with missing id', (done) => {
    axios.delete('/deleteiceboxingredient').catch((error) => {
      expect(error.response.status).toEqual(404);
      done();
    });
  });
  
});





