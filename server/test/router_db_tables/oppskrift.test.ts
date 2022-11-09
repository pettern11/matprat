import axios from 'axios';
import pool from '../../src/mysql-pool';
import app from '../../src/app';
import {oppskriftService, Recipe} from '../../src/service/oppskrift-services'; 

const recipes: Recipe[] = [
  {oppskrift_id: 1, oppskrift_navn: 'Chicken Rice', oppskrift_beskrivelse: 'Good chicken dish', oppskrift_steg: 'Cook rice and chicken', ant_pors: 4, bilde_adr: 'https://www.picture.com', kategori_id: 1, land_id: 1, ant_like: 0, liked: false},
  {oppskrift_id: 2, oppskrift_navn: 'Best Potato', oppskrift_beskrivelse: 'Good potato dish', oppskrift_steg: 'Cook rice and potato', ant_pors: 4, bilde_adr: 'https://www.potato.com', kategori_id: 2, land_id: 2, ant_like: 0, liked: false},
  {oppskrift_id: 3, oppskrift_navn: 'Best Tomato', oppskrift_beskrivelse: 'Good tomato dish', oppskrift_steg: 'Cook rice and tomato', ant_pors: 4, bilde_adr: 'https://www.tomato.com', kategori_id: 1, land_id: 1, ant_like: 0, liked: false},
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

    oppskriftService
      .createRecipe(recipes[0])
      .then(() => oppskriftService.createRecipe(recipes[1]))
      .then(() => oppskriftService.createRecipe(recipes[2]))
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

  test('Fetch recipe by invalid id', (done) => {
    axios.get('/recipe/hei').catch((error) => {
      expect(error.response.status).toEqual(500);
      done();
    });
  });

});

describe('Create recipe (POST)', () =>{

  const newRecipe: any = { recipe: {
    oppskrift_id: 4,
    oppskrift_navn: 'New Recipe',
    oppskrift_beskrivelse: 'Make food',
    oppskrift_steg: 'Throw eggs in pan',
    ant_pors: 4,
    bilde_adr: 'https://www.picture.com',
    kategori_id: 1,
    land_id: 1,
    ant_like: 0,
    liked: false
  }};

  test('Create recipe (201)', (done) => {
  axios.post('/createrecipe', newRecipe).then((response) => {
    expect(response.status).toEqual(201);
    expect(response.data).toEqual({id: 4});
    done();
  });
});  

const existingRecipe: any = { recipe: {oppskrift_navn: 'Chicken Rice', oppskrift_beskrivelse: 'Good chicken dish', oppskrift_steg: 'Cook rice and chicken', ant_pors: 4, bilde_adr: 'https://www.picture.com', kategori_id: 1, land_id: 1, ant_like: 0, liked: false},
};
  
  //Dette skal være mulig, man skal kunne opprette en oppskrift med samme navn som en annen oppskrift og som da kan være helt lik
  test('Create already existing recipe', (done) => {
    axios.post('/createrecipe', existingRecipe).then((response) => {
      expect(response.status).toEqual(201);
      expect(response.data).toEqual({id: 4});

      done();
    });
  });

  test('Create recipe with missing fields', (done) => {
    axios.post('/createrecipe', {recipe: {oppskrift_navn: 'Chicken Rice', oppskrift_steg: 'Cook rice and chicken', ant_pors: 4, bilde_adr: 'https://www.picture.com', kategori_id: 1, land_id: 1, ant_like: 0, liked: false}}).catch((error) => {
      expect(error.response.status).toEqual(400);
      done();
    });
  });

  test('Create recipe with invalid fields', (done) => {
    axios.post('/createrecipe', {recipe: {oppskrift_navn: 'Chicken Riceiyf', oppskrift_beskrivelse: 'Good chicken dishafe', oppskrift_steg: 'Cook rice and chickenafse', ant_pors: 4, bilde_adr: 'https://www.picture.com', kategori_id: 'hei', land_id: 1, ant_like: 0, liked: false}}).catch((error) => {
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

  test('Delete recipe with invalid id', (done) => {
    axios.delete('/deleterecipe/hei').catch((error) => {
      expect(error.response.status).toEqual(500);
      done();
    });
  });

});

describe('Update recipe (PUT)', () => {

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

  test('Update liked', (done) => {
    axios.put('/recipelike/1', {liked: true}).then((response) => {
      expect(response.status).toEqual(200);
      done();
    });
  });

  //denne gir 5% på test, men funker ikke alltid, vet ikke hvorfor
  test('Update liked with non-existing oppskrift_id', (done) => { 
    setTimeout(() => {
      axios.put('/recipelike/100', {liked: true}).catch((error) => {
        expect(error.response.status).toEqual(500);
        done();
      });
    })
  });

  test('Update liked without oppskrift_id', (done) => {
    axios.put('/recipelike/hei', {liked: true}).catch((error) => {
      expect(error.response.status).toEqual(500);
      done();
    });
  });

  

});