import axios from 'axios';
import pool from '../../src/mysql-pool';
import app from '../../src/app';
import {landService, Country} from '../../src/service/land-services';

const land: Country[] = [
    {land_id: 1, land_navn: 'Norge' },
    {land_id: 2, land_navn: 'Sverige' },
    {land_id: 3, land_navn: 'Danmark' },
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
  pool.query('TRUNCATE TABLE land', (error) => {
    if (error) return done(error);

    // Create testTasks sequentially in order to set correct id, and call done() when finished
    landService
      .createCountry(land[0].land_navn)
      .then(() => landService.createCountry(land[1].land_navn)) 
      .then(() => landService.createCountry(land[2].land_navn)) 
      .then(() => done()); // Call done() after kategori[2] has been created
  });
});

// Stop web server and close connection to MySQL server
afterAll((done) => {
  if (!webServer) return done(new Error());
  webServer.close(() => pool.end(() => done()));
});

describe('Fetch countries (GET)', () => {
  test('Fetch all countries (200 OK)', (done) => {
    axios.get('/country').then((response) => {
      expect(response.status).toEqual(200);
      expect(response.data).toEqual(land);
      done();
    });
  });
  
});

describe('Create country (POST)', () => {
  test('Create new country (201 Created)', (done) => {
    const newCountry: any = {name: 'England' };
    axios.post('/newcountry', newCountry).then((response) => {
      expect(response.status).toEqual(201);
      done();
    });
  });

  test('Create new country without name attribute (Bad Request)', (done) => {
    const newCountry: any = {};
    axios.post('/newcountry', newCountry).catch((error) => {
      expect(error.response.status).toEqual(500);
      done();
    });
  });

  test('Create new country with empty name attribute (Bad Request)', (done) => {
    const newCountry: any = {name: null };
    axios.post('/newcountry', newCountry).catch((error) => {
      expect(error.response.status).toEqual(500);
      expect(error.response.data.sqlMessage).toEqual("Column 'land_navn' cannot be null");

      done();
    });
  });

});
 
