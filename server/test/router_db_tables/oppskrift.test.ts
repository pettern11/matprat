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


// Since API is not compatible with v1, API version is increased to v2
axios.defaults.baseURL = 'http://localhost:3001/api/v2';

let webServer: any;
beforeAll((done) => {
  // Use separate port for testing
  webServer = app.listen(3001, () => done());
});

beforeEach((done) => {
  // Delete all ingrediens, and reset id auto-increment start value
  pool.query('TRUNCATE TABLE oppskrift', (error) => {
    if (error) return done(error)

    service
      .createRecipe(recipes[0])
      .then(() => service.createRecipe(recipes[1]))
      .then(() => service.createRecipe(recipes[2]))
      .then(() => done());
  });
});

// Stop web server and close connection to MySQL server
afterAll((done) => {
  if (!webServer) return done(new Error());
  webServer.close(() => pool.end(() => done()));
});

describe('Fetch recipes (GET)', () => {
  test('Fetch all recipes', (done) => {
    axios.get('/').then((response) => {
      expect(response.status).toEqual(200);
      expect(response.data).toEqual(recipes);
      done();
    });
  });

  test('Fetch recipe by id', (done) => {
    axios.get('/recipe/1').then((response) => {
      expect(response.status).toEqual(200);
      expect(response.data[0]).toEqual(recipes[0]);
      done();
    });
  });
  
  //Må bruke catch når errorkoden er 4xx eller 5xx
  test('Fetch recipe by id that does not exist', (done) => {
    axios.get('/recipe/4').catch((error) => {
      expect(error.response.status).toEqual(404);
      expect(error.response.data).toEqual('Oppskrift med id 4 ikke funnet.');
      done();
    });
  });

});

describe('Create recipe (POST)', () =>{
  //tror de tre neste testene kan slås sammen til en test, eller at alle rett og slett tester det samme
  test('Create already existing recipe', (done) => {
    axios.post('/createrecipe', recipes[0]).catch((error) => {
      expect(error.response.status).toEqual(500);
      done();
    });
  });

  test('Create recipe with missing fields', (done) => {
    axios.post('/createrecipe', {oppskrift_navn: 'Chicken Rice', oppskrift_beskrivelse: 'Good chicken dish', oppskrift_steg: 'Cook rice and chicken', ant_pors: 4, bilde_adr: 'https://www.picture.com', kategori_id: 1, land_id: 1, ant_like: 0, liked: false}).catch((error) => {
      expect(error.response.status).toEqual(500);
      done();
    });
  });

  test('Create recipe with invalid fields', (done) => {
    axios.post('/createrecipe', {oppskrift_navn: 'Chicken Rice', oppskrift_beskrivelse: 'Good chicken dish', oppskrift_steg: 'Cook rice and chicken', ant_pors: 4, bilde_adr: 'https://www.picture.com', kategori_id: '1', land_id: 1, ant_like: 0, liked: false}).catch((error) => {
      expect(error.response.status).toEqual(500);
      done();
    });
  });

});

describe('Delete recipe (DELETE)', () => {

  test('Delete recipe by id', (done) => {
    axios.delete('/deleterecipe/1').then((response) => {
      expect(response.status).toEqual(200);
      done();
    });
  });

  test('Delete recipe by id that does not exist', (done) => {
    axios.delete('/deleterecipe/4').catch((error) => {
      expect(error.response.status).toEqual(500);
      done();
    });
  });

});

describe('Update recipe (PUT)', () => {
  //Dårlig test, sjekker egentlig bare at det ikke eksisterer feil path
  test('Update recipe without oppskrift_id', (done) => {
    axios.put('/update_recipe', {recipe:{oppskrift_navn: 'Chicken Ricese', oppskrift_beskrivelse: 'Good chicken dish', oppskrift_steg: 'Cook rice and chicken', ant_pors: 4, bilde_adr: 'https://www.picture.com'}}).catch((error) => {
    expect(error.response.status).toEqual(404);
      done();
    });
  });

  test('Update recipe', (done) => {
    axios.put('/update_recipe/1', {recipe:{ oppskrift_navn: 'Chicken Rices', oppskrift_beskrivelse: 'Good chicken dish', oppskrift_steg: 'Cook rice and chicken', bilde_adr: 'www.vg.no/pic2', ant_pors: 4, oppskrift_id: 1}}).then((response) => {
      expect(response.status).toEqual(200);
      done();
    });
  });



  //disse to er like, de funker ikke fordi den blir reslova fordi vi ikke har feilsjekker som sjekker at recipe har riktige felter, derfor vil kun den med then fungere, ikke catch
  test('Update recipe with missing fields', (done) => {
    axios.put('/update_recipe/1', {recipe:{ oppskrift_navn: 'Chicken Rice', oppskrift_beskrivelse: 'Good chicken dish', oppskrift_steg: 'Cook rice and chicken', ant_pors: 4}}).catch((error) => {
      expect(error.response.status).toEqual(500);
      done();
    });
  });
  

});