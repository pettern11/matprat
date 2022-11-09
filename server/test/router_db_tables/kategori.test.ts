import axios from 'axios';
import pool from '../../src/mysql-pool';
import app from '../../src/app';
import {kategoriService, Category} from '../../src/service/kategori-services';

const kategori: Category[] = [
    {kategori_id: 1, kategori_navn: 'vegetar' },
    {kategori_id: 2, kategori_navn: 'kjøtt' },
    {kategori_id: 3, kategori_navn: 'veggis' },
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
  pool.query('TRUNCATE TABLE kategori', (error) => {
    if (error) return done(error);

    // Create testTasks sequentially in order to set correct id, and call done() when finished
    kategoriService
      .createCategory(kategori[0].kategori_navn)
      .then(() => kategoriService.createCategory(kategori[1].kategori_navn)) 
      .then(() => kategoriService.createCategory(kategori[2].kategori_navn)) 
      .then(() => done()); // Call done() after kategori[2] has been created
  });
});

// Stop web server and close connection to MySQL server
afterAll((done) => {
  if (!webServer) return done(new Error());
  webServer.close(() => pool.end(() => done()));
});

describe('Fetch categories (GET)', () => {
  test('Fetch all categories (200 OK)', (done) => {
    axios.get('/category').then((response) => {
      expect(response.status).toEqual(200);
      expect(response.data).toEqual(kategori);
      done();
    });
  });
  
});

describe('Create new category (POST)', () => {
  test('Create new category (201 Created)', (done) => {
    const newCategory: any = {name: 'fisk' };
    axios.post('/newcategory', newCategory).then((response) => {
      expect(response.status).toEqual(201);
      done();
    });
  }); 

  test('Create new category without name attribute (Bad Request)', (done) => {
    const newCategory: any = { };
    axios.post('/newcategory', newCategory).catch((error) => {
      expect(error.response.status).toEqual(500);
      done();
    });
  });

  test('Create new category with null name attribute (Bad Request)', (done) => {
    const newCategory: any = {name: null };
    axios.post('/newcategory', newCategory).catch((error) => {
      expect(error.response.status).toEqual(500);
      expect(error.response.data.sqlMessage).toEqual("Column 'kategori_navn' cannot be null");
      done();
    });
  });
});
