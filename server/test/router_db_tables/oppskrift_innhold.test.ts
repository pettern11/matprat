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

describe('oppskrift_innhold GET(200)', () => {
  test('Return all recipe content', (done) => {
    axios.get('/recipecontent').then((response) => {
      console.log(response.data);
      expect(response.status).toBe(200);
      expect(response.data).toEqual(recipeContent);
      done();
    });
  });
});