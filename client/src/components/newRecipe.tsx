import * as React from 'react';
import { Component } from 'react-simplified';
import { Alert, Card, Row, Column, Form, Button, RecipeView } from '.././widgets';
import { NavLink, Redirect } from 'react-router-dom';
import service, {
  Country,
  Category,
  Ingredient,
  Recipe,
  Recipe_Content,
  List,
  ElementShoppingList,
} from '.././service';
import { createHashHistory } from 'history';

const history = createHashHistory(); // Use history.push(...) to programmatically change path, for instance after successfully saving a student
export class NewRecipe extends Component {
  countries: Country[] = [];
  categories: Category[] = [];
  ingredients: Ingredient[] = [];
  recipe_content: Recipe_Content[] = [];
  ingredient: string = '';
  selectedIngredients: Ingredient[] = [];
  selectIngredientReset: Ingredient = { ingred_id: 0, ingred_navn: 'Velg ingrediens' };
  selectedIngredient: Ingredient = {
    ingred_id: 1,
    ingred_navn: '',
  };

  recipeIngredients: Ingredient[] = [];

  name: string = '';
  description: string = '';
  steps: string = '';
  portions: number = 0;
  picture_adr: string = '';
  category_id: number = 0;
  category_name: string = '';
  country_id: number = 0;
  country_name: string = '';
  searchterm: string = '';

  render() {
    return (
      <>
        <Card title="Registrer en ny oppskrift">
          {/* input navn */}
          <Row>
            <Column>
              <Column width={2}>
                <Form.Label>Name:</Form.Label>
              </Column>
              <Column>
                <Form.Textarea
                  id="recipe_name_input"
                  type="text"
                  value={this.name}
                  onChange={(event) => (this.name = event.currentTarget.value)}
                  rows={3}
                />
              </Column>
            </Column>
            {/* input beksrivelse */}
            <Column>
              <Column width={2}>
                <Form.Label>Description:</Form.Label>
              </Column>
              <Column>
                <Form.Textarea
                  id="recipe_description_input"
                  type="text"
                  value={this.description}
                  onChange={(event) => (this.description = event.currentTarget.value)}
                  rows={3}
                />
              </Column>
            </Column>
            {/* input steg */}
            <Column>
              <Column width={2}>
                <Form.Label>Steg:</Form.Label>
              </Column>
              <Column>
                <Form.Textarea
                  id="recipe_steps_input"
                  type="text"
                  value={this.steps}
                  onChange={(event) => (this.steps = event.currentTarget.value)}
                  rows={3}
                />
              </Column>
            </Column>
          </Row>
          <Row>
            {/* input bilde url */}
            <Column>
              <Column width={2}>
                <Form.Label>Bildeurl:</Form.Label>
              </Column>
              <Column>
                <Form.Input
                  id="recipe_picture_url_input"
                  type="text"
                  value={this.picture_adr}
                  onChange={(event) => (this.picture_adr = event.currentTarget.value)}
                />
              </Column>
            </Column>
            {/* velg land retten kommer fra */}
            <Column>
              <Column width={2}>
                <Form.Label>Land:</Form.Label>
              </Column>
              <Column>
                <select
                  key={'choseCountry'}
                  id="choseCountry"
                  onChange={() => {
                    this.checkCountry(event?.target.value);
                  }}
                >
                  <option selected disabled>
                    Velg land
                  </option>
                  {this.countries.map((country: Country, i: number) => (
                    <option key={country.land_id} value={country.land_id}>
                      {country.land_navn}
                    </option>
                  ))}
                </select>
                <Form.Input
                  id="addCountry"
                  type="text"
                  value={this.country_name}
                  onChange={(event) => (this.country_name = event.currentTarget.value)}
                  placeholder="Skriv inn landet retten kommer fra"
                ></Form.Input>
                <Button.Success
                  id="addCountryBtn"
                  onClick={() => {
                    this.addCountryFunc();
                  }}
                >
                  Legg til
                </Button.Success>
                {/* må lage select og options som cars */}
              </Column>
            </Column>
            {/* velg retten sin kategori */}
            <Column>
              <Column width={2}>
                <Form.Label>Kategori:</Form.Label>
              </Column>
              <Column>
                <select
                  key={'choseCategory'}
                  id="choseCategory"
                  onChange={() => {
                    this.checkCategory(event?.target.value);
                  }}
                >
                  <option selected disabled>
                    Velg kategori
                  </option>
                  {this.categories.map((category: Category) => (
                    <option key={category.kategori_id.toString()} value={category.kategori_id}>
                      {category.kategori_navn}
                    </option>
                  ))}
                </select>
                <Form.Input
                  id="addCategory"
                  type="text"
                  value={this.category_name}
                  onChange={(event) => (this.category_name = event.currentTarget.value)}
                  placeholder="Skriv inn kattegorien retten tilhører"
                ></Form.Input>
                <Button.Success
                  id="addCategoryBtn"
                  onClick={() => {
                    this.addCategoryFunc();
                  }}
                >
                  Legg til
                </Button.Success>
                {/* må lage select og options som cars */}
              </Column>
            </Column>
          </Row>
          {/* input antall porsjoner */}
          <Column>
            <Column width={2}>
              <Form.Label>Porsjoner:</Form.Label>
            </Column>
            <Column>
              <Form.Input
                id="recipe_portions_input"
                type="number"
                value={this.portions}
                //@ts-ignore
                onChange={(event) => (this.portions = event.currentTarget.value)}
              />
            </Column>
          </Column>
          {/* print ut alle ingrediense som allerede er i databasen */}
          {/* vidre ideer her er at vi setter en viss lengde og bredde på diven og så hvis den overflower så må man bare skulle 
          nedover, her kan vi også implementere et søkefelt etterhvert for ingredienser. */}
          <Column>
            <Card title="Søk etter ingrediens">
              <Column>
                <h6>Søk</h6>
                <Form.Input
                  id="newRecipeSearch"
                  type="text"
                  value={this.searchterm}
                  onChange={(event) => {
                    this.search(event.currentTarget.value);
                    this.searchterm = event.currentTarget.value;
                  }}
                />
                <select
                  id="selectIngredientNewRecipe"
                  onChange={(event) => {
                    this.selectedIngredient.ingred_id = Number(event.currentTarget.value);
                    console.log(event.currentTarget.selectedOptions[0].text);
                    this.selectedIngredient.ingred_navn =
                      event.currentTarget.selectedOptions[0].text;
                  }}
                >
                  {this.selectedIngredients.map((ingredient) => (
                    <option key={ingredient.ingred_id} value={ingredient.ingred_id}>
                      {ingredient.ingred_navn}
                    </option>
                  ))}
                </select>
              </Column>
              <Button.Success
                id="btnIngredAdd"
                onClick={() => {
                  console.log(this.selectedIngredient);
                  this.chooseIngredientFunc(this.selectedIngredient.ingred_id);
                }}
              >
                Legg til ny ingrediens
              </Button.Success>
            </Card>
          </Column>
          {/* legg til ingredienser */}
          <Column>
            <Form.Input
              id="createIngredient"
              type="text"
              style={{ width: '400px' }}
              value={this.ingredient}
              onChange={(event) => (this.ingredient = event.currentTarget.value)}
              placeholder="Legg til ingredienser"
            ></Form.Input>
            <Button.Success
              id="createIngredientFunc"
              onClick={() => {
                this.addIngredientFunc();
              }}
            >
              Legg til
            </Button.Success>
          </Column>
          {/* velg hvor mye av hver inngrediense */}
          <Column>
            <h5>
              Klikk på ingrediensene over for at de skal komme hit og du kan velge hvor mye du skal
              ha av hver ingrediens
            </h5>
            <div id="ingreditentList"></div>
          </Column>
        </Card>
        <Button.Success
          id="addRecipeBtn"
          onClick={() => {
            this.addRecipe();
          }}
        >
          Send oppskriften opp til the database
        </Button.Success>
      </>
    );
  }
  search(searchterm: string) {
    this.selectedIngredients = this.ingredients.filter((ingredient) =>
      ingredient.ingred_navn.toLowerCase().includes(searchterm.toLowerCase())
    );
    console.log(this.selectedIngredients);
    if (this.selectedIngredients.length === 0) {
      this.selectedIngredient = { ingred_id: 0, ingred_navn: '' };
    } else {
      this.selectedIngredient.ingred_id = this.selectedIngredients[0].ingred_id;
    }
  }
  addRecipe() {
    let recipe: Recipe = {
      oppskrift_id: 0,
      oppskrift_navn: this.name,
      oppskrift_beskrivelse: this.description,
      oppskrift_steg: this.steps,
      ant_pors: this.portions,
      bilde_adr: this.picture_adr,
      kategori_id: this.category_id,
      land_id: this.country_id,
      ant_like: 0,
      liked: false,
    };
    if (this.recipe_content.length == 0) {
      Alert.info('Du må legge til ingredienser i oppskriften din');
    } else
      service
        .createRecipe(recipe)
        .then((id) => this.addRecipeIngredient(id))
        .catch((error) => Alert.danger('Creating new recipe: ' + error.message));
  }
  addRecipeIngredient(id: number) {
    this.recipe_content.forEach((element) => {
      element.oppskrift_id = id;
    });
    console.log('første console log', this.recipe_content);
    service
      .createRecipeIngredient(this.recipe_content)
      .then(() => history.push('/recipe/' + id))
      .catch((error) => Alert.danger('Creating new recipe: ' + error.message));

    console.log(this.recipe_content);
  }
  chooseIngredientFunc(id: number) {
    if (id === 0 || id === undefined || id === null || id === '') {
      Alert.info('Du må velge en ingrediens');
    } else if (this.recipeIngredients.some((e) => e == id)) {
      Alert.info('Denne ingrediensen er allerede lagt til');
    } else {
      this.selectedIngredient = this.selectIngredientReset;
      console.log(this.recipeIngredients.some((e) => e == id));
      console.log('før', this.recipeIngredients);
      this.recipeIngredients.push(id);
      console.log('etter', this.recipeIngredients);

      let name = this.ingredients.find((ingredient) => ingredient.ingred_id == id)?.ingred_navn;
      const btn = document.getElementById('ingred' + id) as HTMLButtonElement | null;
      if (btn != null) {
        btn.disabled = true;
      }
      /* id må være any for å kunne bruke variablen i setattribute. Den forventer to strings så 
    hvis vi hadde deklarert den som number hadde setAttribute blitt sint*/
      // lager en const som legges til i objectet recipe_content
      const add = { oppskrift_id: 0, ingred_id: id, mengde: 0, maleenhet: '' };

      this.recipe_content.push(add);

      // finner index til dette elemetet i objektet, skal brukes senere til å mappe
      // hver enkelt inputfelt til et obejct sin menge eller måleenhet
      const index = this.recipe_content
        .map(function (element) {
          return element.ingred_id;
        })
        .indexOf(id);

      const emFood = document.createElement('em');
      const inputNumberOf = document.createElement('input');
      const inputMeasurment = document.createElement('input');
      const deleteBtn = document.createElement('button');
      const ingredList =
        document.getElementById('ingreditentList') || document.createElement('div');
      emFood.innerHTML = ' <br />' + name;
      emFood.setAttribute('id', 'emFood' + id);

      inputNumberOf.type = 'number';
      inputNumberOf.setAttribute('id', 'inputNumberOf' + id);
      //@ts-ignore
      inputNumberOf.value = this.recipe_content[index].mengde;
      inputNumberOf.onchange = (event) =>
        (this.recipe_content[index].mengde = event.currentTarget.value);

      inputMeasurment.type = 'text';
      inputMeasurment.setAttribute('id', 'inputMeasurment' + id);
      inputMeasurment.value = this.recipe_content[index].maleenhet;
      inputMeasurment.onchange = (event) =>
        (this.recipe_content[index].maleenhet = event.currentTarget.value);

      deleteBtn.innerHTML = 'x';
      deleteBtn.onclick = () => {
        this.recipeIngredients.splice(index, 1);
        this.recipe_content.splice(index, 1);
        btn != null ? (btn.disabled = false) : '';
        emFood.remove();
        inputNumberOf.remove();
        inputMeasurment.remove();
        deleteBtn.remove();
      };

      ingredList.appendChild(emFood);
      ingredList.appendChild(inputNumberOf);
      ingredList.appendChild(inputMeasurment);
      ingredList.appendChild(deleteBtn);
    }
  }
  addCategoryFunc() {
    // sjekker om kategorien allerede finnes i arrayen med kategorier, hvis ikke legger den til landet i databasen
    // hentet fra databasen
    let isFound = this.categories.some((category) => {
      if (category.kategori_navn.toLowerCase() == this.category_name.toLowerCase()) {
        return true;
      }
      return false;
    });

    console.log(isFound);
    const result =
      this.category_name.charAt(0).toUpperCase() + this.category_name.slice(1).toLowerCase();
    this.category_name = result;
    if (!isFound && this.category_name != '') {
      service.createCategory(this.category_name).then(() =>
        service
          .getAllCategory()
          .then((categories) => (this.categories = categories))
          .catch((error) => Alert.danger('Error : ' + error.message))
      );
    }
  }
  addCountryFunc() {
    // sjekker om landet allerede finnes i arrayen med land, hvis ikke legger den til landet i databasen
    // hentet fra databasen
    let isFound = this.countries.some((country) => {
      if (country.land_navn.toLowerCase() == this.country_name.toLowerCase()) {
        return true;
      }
      return false;
    });

    console.log(isFound);
    const result =
      this.country_name.charAt(0).toUpperCase() + this.country_name.slice(1).toLowerCase();
    this.country_name = result;
    if (!isFound && this.country_name != '') {
      service.createCountry(this.country_name).then(() =>
        service
          .getAllCountry()
          .then((countries) => (this.countries = countries))
          .catch((error) => Alert.danger('Error : ' + error.message))
      );
    }
  }
  addIngredientFunc() {
    // sjekker om ingrediensen allerede finnes i arrayen med ingredienser
    // hentet fra databasen
    let isFound = this.ingredients.some((ingredient) => {
      console.log(ingredient.ingred_navn == this.ingredient);
      if (ingredient.ingred_navn.toLowerCase() == this.ingredient.toLowerCase()) {
        return true;
      }
      return false;
    });

    console.log(isFound);
    if (!isFound && this.ingredient != '') {
      service
        .createIngredient(this.ingredient)
        .then(() =>
          service
            .getAllIngredient()
            .then(
              (ingredients) => (
                (this.ingredients = ingredients),
                this.chooseIngredientFunc(ingredients[ingredients.length - 1].ingred_id)
              )
            )
            .catch((error) => Alert.danger('Error : ' + error.message))
        )
        .catch((error) => Alert.danger('Error : ' + error.message));
      this.ingredient = '';
    } else Alert.info('Ingrediensen finnes allerede eller du har ikke skrevet noe');
  }
  checkCountry(value: number) {
    this.country_id = value;
  }

  checkCategory(value: number) {
    this.category_id = value;
  }
  mounted() {
    this.selectedIngredient.ingred_id = 1;
    this.selectedIngredient.ingred_navn = '';

    service
      .getAllCountry()
      .then((countries) => (this.countries = countries))
      .catch((error) => Alert.danger('Error getting countries: ' + error.message));
    service
      .getAllCategory()
      .then((categories) => (this.categories = categories))
      .catch((error) => Alert.danger('Error getting categories: ' + error.message));
    service
      .getAllIngredient()
      .then(
        (ingredients) => (
          (this.ingredients = ingredients),
          (this.selectedIngredients = ingredients),
          (this.selectedIngredient.ingred_navn = ingredients[0].ingred_navn),
          (this.selectedIngredient.ingred_id = ingredients[0].ingred_id)
        )
      )
      .catch((error) => Alert.danger('Error getting categories: ' + error.message));
  }
}
