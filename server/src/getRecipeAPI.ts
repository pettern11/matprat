// @ts-nocheck
import mysql from 'mysql2';

/*
For å kjøres scriptet bruker man kommandoen "npm run addRecipes" i terminalen i server mappen. 
npm run addRecipes

getRecipeAPI.ts bruker ES-Modules, og krever ES5/6, og ikke commonJS.
Node forventer commonjs, men babel-node kan oversette es-moduler, vi bruker derfor babel-node for å kjøre scriptet.

babel-node skal i teorien fungere alene, men fant ut det ikke kjører uten nodemon foran. 
Enkleste løsning er å bruke nodemon, og manuelt avslutte programmet etter det har kjørt. */
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  // Reduce load on NTNU MySQL server
  connectionLimit: 1,
  // Convert MySQL boolean values to JavaScript boolean values
  typeCast: (field, next) =>
    field.type == 'TINY' && field.length == 1 ? field.string() == '1' : next(),
});
let doneVariable = false;

let interval = 0;
let recipe = [];
let country = [];
let category = [];
let ingredient = [];
let recipe_ingredient = [];
let totLength = 0;
class API_Calls {
  alfabeth1 = ['a', 'b', 'c'];
  alfabeth2 = ['d', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm'];
  alfabeth3 = ['n', 'o', 'p', 'r', 's', 't', 'v', 'w', 'y'];
  getRecipeA_C() {
    this.alfabeth1.forEach((letter) => {
      fetch('https://www.themealdb.com/api/json/v1/1/search.php?f=' + letter)
        .then((res) => res.json())
        .then((data) => (Recipe(data.meals), (totLength += data.meals.length)))
        .catch((err) => console.log('error getting recipe A-C', err));
    });
  }
  getRecipeD_M() {
    this.alfabeth2.forEach((letter) => {
      fetch('https://www.themealdb.com/api/json/v1/1/search.php?f=' + letter)
        .then((res) => res.json())
        .then((data) => (Recipe(data.meals), (totLength += data.meals.length)))
        .catch((err) => console.log('error getting recipe D-M', err));
    });
  }
  getRecipeN_Y() {
    this.alfabeth3.forEach((letter) => {
      fetch('https://www.themealdb.com/api/json/v1/1/search.php?f=' + letter)
        .then((res) => res.json())
        .then((data) => (Recipe(data.meals), (totLength += data.meals.length)))
        .catch((err) => console.log('Error getting recipe N-Y', err));
    });
  }
  getCategory() {
    fetch('https://www.themealdb.com/api/json/v1/1/list.php?c=list')
      .then((res) => res.json())
      .then((data) => Category(data.meals))
      .catch((err) => console.log('Error getting category', err));
  }
  getCountry() {
    fetch('https://www.themealdb.com/api/json/v1/1/list.php?a=list')
      .then((res) => res.json())
      .then((data) => Country(data.meals))
      .catch((err) => console.log('Error getting country', err));
  }
  getIngredients() {
    fetch('https://www.themealdb.com/api/json/v1/1/list.php?i=list')
      .then((res) => res.json())
      .then((data) => pushIngredient(data.meals))
      .catch((err) => console.log('Error getting ingredient', err));
  }
}
const apiCalls = new API_Calls();
apiCalls.getIngredients();
apiCalls.getCategory();
apiCalls.getCountry();

apiCalls.getRecipeA_C();
apiCalls.getRecipeD_M();
apiCalls.getRecipeN_Y();

//funskjon som først får land fra api, og legger det til i arrayet country
//pusher det opp til databasen
function Country(array) {
  array.forEach((element, i) => {
    country.push({ land_id: i + 1, land_navn: element.strArea });
  });
  country.forEach((element) => {
    pool.query(
      'INSERT INTO land SET land_id=?, land_navn=?',
      [element.land_id, element.land_navn],
      (error, results) => {
        if (error) return error;

        results;
      }
    );
  });
}

//funskjon som først får kategori fra api, og legger det til i arrayet category
//pusher det opp til databasen
function Category(array) {
  array.forEach((element, i) => {
    category.push({ kategori_id: i + 1, kategori_navn: element.strCategory });
  });
  category.forEach((element) => {
    pool.query(
      'INSERT INTO kategori SET kategori_id=?,kategori_navn=?',
      [element.kategori_id, element.kategori_navn],
      (error, results) => {
        if (error) return error;

        results;
      }
    );
  });
}

//funksjonen som først får ingrediensene fra api, og legger det til i arrayet ingredient
//deretter blir alle ingredienese pushet opp til databasen
function pushIngredient(array) {
  array.forEach((element) => {
    ingredient.push({ id: element.idIngredient, name: element.strIngredient });
  });

  ingredient.forEach((element) => {
    pool.query(
      'INSERT INTO ingrediens SET ingred_id=?, ingred_navn=?',
      [element.id, element.name],
      (error, results) => {
        if (error) return error;

        results;
      }
    );
  });
}

//fjerner alle bokstavene fra ingrediens måleenheten og returnerer bare tallet
function stringToNumber(string) {
  let number;
  let numsStr = string.replace(/[^0-9/]/g, '');
  let firstNumber = parseInt(numsStr);
  number = firstNumber;
  return number;
}
//fjerner alle tallene fra ingrediens måleenheten og returnerer bare bokstavene
function removeNumber(string) {
  let newString = string.replace(/[^a-zA-Z ]/g, '');
  if (newString.includes('oz')) {
    newString = newString.replace('oz', '');
  }
  return newString;
}

function Recipe(array) {
  setTimeout(() => {
    array.forEach((element) => {
      if (!recipe.includes(element.idMeal)) {
        //finner index til land og category og lagrer det i variabler til senere, plusser på 1 fordi id starter på 1 og ikke null
        const indexCountry = country.map((e) => e.land_navn).indexOf(element.strArea);
        const indexCategory = category.map((e) => e.kategori_navn).indexOf(element.strCategory);
        //siden databasen vi henter fra er lagt opp dårlig må vi liste alle variablene og så loope gjennom dem
        const ingredient_list = [
          element.strIngredient1,
          element.strIngredient2,
          element.strIngredient3,
          element.strIngredient4,
          element.strIngredient5,
          element.strIngredient6,
          element.strIngredient7,
          element.strIngredient8,
          element.strIngredient9,
          element.strIngredient10,
          element.strIngredient11,
          element.strIngredient12,
          element.strIngredient13,
          element.strIngredient14,
          element.strIngredient15,
          element.strIngredient16,
          element.strIngredient17,
          element.strIngredient18,
          element.strIngredient19,
          element.strIngredient20,
        ];
        const ingredient_measure = [
          element.strMeasure1,
          element.strMeasure2,
          element.strMeasure3,
          element.strMeasure4,
          element.strMeasure5,
          element.strMeasure6,
          element.strMeasure7,
          element.strMeasure8,
          element.strMeasure9,
          element.strMeasure10,
          element.strMeasure11,
          element.strMeasure12,
          element.strMeasure13,
          element.strMeasure14,
          element.strMeasure15,
          element.strMeasure16,
          element.strMeasure17,
          element.strMeasure18,
          element.strMeasure19,
          element.strMeasure20,
        ];
        let ingred = [];
        let measure = [];
        for (let i = 0; i < 20; i++) {
          //finner ingrediens indexen i arrayet ingredient
          let indexIngred = ingredient
            .map((e) => e.name.toLowerCase())
            .indexOf(ingredient_list[i] ? ingredient_list[i].toLowerCase() : '');

          //legger til ingrediens id i ingred arrayet
          if (ingredient[indexIngred]) {
            ingred.push(ingredient[indexIngred].id);
          }
          //hvis ingredient_measure[i] ikke er null eller undefined vil den bli lagt til i arrayet measure
          if (ingredient_measure[i]) {
            let a = stringToNumber(ingredient_measure[i]);
            let b = removeNumber(ingredient_measure[i]);

            // sjekker om antall er null og om type er '', hvis det er det får det ikke bli puishet opp i arrayet
            if (!isNaN(a) || b != '') {
              measure.push({
                number: a,
                type: b,
              });
            }
          }
        }
        //legger til oppskriften i recipe arrayet
        recipe.push({
          id: element.idMeal,
          name: element.strMeal,
          instruction: element.strInstructions,
          picture: element.strMealThumb,
          country: country[indexCountry].land_id,
          category: category[indexCategory].kategori_id,
        });
        //legger til link mellom oppskrfiten og ingredienser i recipe_ingredient arrayet
        for (let i = 0; i < 20; i++) {
          //sjekker om det det er null eller undefined eller NaN og breaker hvis det er det
          if (
            measure[i] == undefined ||
            (isNaN(measure[i].number) && measure[i].type == '') ||
            (measure[i].number && measure[i].type == null)
          ) {
            break;
          }
          //legger det til i recipe_ingredient arrayet
          else {
            recipe_ingredient.push({
              recipe_id: element.idMeal,
              ingred_id: ingred[i],
              number: measure[i].number,
              type: measure[i].type,
            });
          }
        }
      }
    });
    totLength == recipe.length ? pushRecipe() : '';
  }, 5000);
}
//pusher opp alle oppskriftene til databasen
function pushRecipe() {
  recipe.forEach((element) => {
    pool.query(
      'INSERT INTO oppskrift SET oppskrift_id=?, oppskrift_navn=?, oppskrift_beskrivelse=?, oppskrift_steg=?,ant_pors=?,bilde_adr=?,kategori_id=?,land_id=?,ant_like=?',
      [
        element.id,
        element.name,
        '',
        element.instruction,
        4,
        element.picture,
        '' + element.category + '',
        '' + element.country + '',
        0,
      ],
      (error, results) => {
        if (error) return error;
        results;
      }
    );
  });
  //når alle oppskriftene er pushet opp kjører funksjonen matchRecipeIngredient
  matchRecipeIngredient();
}
//pusher opp koblingen mellom oppskrifter og ingredienter
function matchRecipeIngredient() {
  recipe_ingredient.forEach((element, i) => {
    //hvis det er en ingrediens uten megde setter vi mengden til 1 fordi mengde kan ikke være null
    let number;
    if (isNaN(element.number)) {
      number = 1;
    } else {
      number = element.number;
    }
    //pusher opp koblingen mellom oppskrift og ingrediens til databasen
    pool.query(
      'INSERT INTO oppskrift_innhold SET oppskrift_id=?, ingred_id=?, mengde=?, maleenhet=?',
      [element.recipe_id, element.ingred_id, number, element.type],
      (error, results) => {
        if (error) return error;

        results;
      }
    );
  });
  interval = setInterval(() => {
    pool.query('SELECT * FROM oppskrift_innhold', (error, results: RowDataPacket[]) => {
      if (error) return reject(error);
      if (results.length <= recipe_ingredient.length) {
        done();
      }
    });
  }, 1000);
}
function done() {
  if (!doneVariable) {
    console.log('Scriptet er ferdig og du kan trykke ctrl + c to ganger for å avslutte scriptet');
    clearInterval(interval);
    doneVariable = true;
  }
}
