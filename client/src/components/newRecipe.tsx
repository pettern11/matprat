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
  selectedIngredient: Ingredient = {
    ingred_id: 1,
    ingred_navn: '',
  };

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
                  style={{ width: '210px' }}
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
                  style={{ width: '210px' }}
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
                  style={{ width: '210px' }}
                />
              </Column>
            </Column>
          </Row>
          <br />
          <Row>
            {/* velg land retten kommer fra */}
            <Column>
              <Column width={2}>
                <Form.Label>Land:</Form.Label>
              </Column>
              <Column>
                <select
                  className="form-select"
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
                  className="form-select"
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
          </Row>
          <br />
          <Row>
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
              <Column>
                <Column width={2}>
                  <Form.Label>Søk:</Form.Label>
                </Column>
                <select
                  className="form-select"
                  id="selectIngredientNewRecipe"
                  onChange={(event) => {
                    console.log(event.target.value);
                    this.selectedIngredient.ingred_id = Number(event.currentTarget.value);
                    this.selectedIngredient.ingred_navn =
                      event.currentTarget.selectedOptions[0].text;
                  }}
                  style={{ width: '210px' }}
                >
                  {this.selectedIngredients.map((ingredient, i) => (
                    // @ts-ignore
                    // {i==0?console.log('homo'):''}
                    //make the first option the selected option

                    <option key={ingredient.ingred_id} value={ingredient.ingred_id}>
                      {ingredient.ingred_navn}
                    </option>
                  ))}
                </select>
                <Form.Input
                  id="newRecipeSearch"
                  placeholder="Søk"
                  type="text"
                  value={this.searchterm}
                  onChange={(event) => {
                    this.search(event.currentTarget.value);
                    this.searchterm = event.currentTarget.value;
                  }}
                />
              </Column>
              <Button.Success
                id="btnIngredAdd"
                onClick={() => {
                  this.chooseIngredientFunc(this.selectedIngredient.ingred_id);
                }}
              >
                Legg til ingrediens
              </Button.Success>
            </Column>
            {/* legg til ingredienser */}
            <Column>
              <Form.Input
                id="createIngredient"
                type="text"
                style={{ width: '210px' }}
                value={this.ingredient}
                onChange={(event) => (this.ingredient = event.currentTarget.value)}
                placeholder="Legg til ny ingrediens"
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
          </Row>
          <br />
          {/* velg hvor mye av hver inngrediense */}
          <Column>
            <div id="outprintIngredient" className="scroll">
              {this.recipe_content.map((rc, i) => (
                <Row key={i}>
                  <p style={{ width: '215px' }}>
                    {this.ingredients.filter((ing) => rc.ingred_id == ing.ingred_id)[0].ingred_navn}
                  </p>
                  <input
                    className="form-control"
                    id={'ingredNumber' + i.toString()}
                    style={{ width: '75px', marginRight: '0px' }}
                    type="number"
                    value={rc.mengde}
                    onChange={(event) =>
                      //@ts-ignore
                      (rc.mengde = event.currentTarget.value)
                    }
                  />
                  <input
                    className="form-control"
                    style={{ width: '120px' }}
                    id={'ingredType' + i.toString()}
                    type="text"
                    value={rc.maleenhet}
                    onChange={(event) =>
                      //@ts-ignore
                      (rc.maleenhet = event.currentTarget.value)
                    }
                  />
                  <Column width={2}>
                    <Button.Danger onClick={() => this.deleteIngredient(rc.ingred_id)}>
                      x
                    </Button.Danger>
                  </Column>
                </Row>
              ))}
            </div>
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
  deleteIngredient(ingred_id: number) {
    //find index of ingred_id in recipeContent
    const index = this.recipe_content.findIndex((element) => element.ingred_id == ingred_id);
    //splice this index from recipeContent
    this.recipe_content.splice(index, 1);
  }
  search(searchterm: string) {
    this.selectedIngredients = this.ingredients.filter((ingredient) =>
      ingredient.ingred_navn.toLowerCase().includes(searchterm.toLowerCase())
    );
    //@ts-ignore

    if (this.selectedIngredients.length === 0) {
      this.selectedIngredient = { ingred_id: 0, ingred_navn: '' };
    } else {
      document.getElementById('selectIngredientNewRecipe').value =
        this.selectedIngredients[0].ingred_id;
      //@ts-ignore
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
    service
      .createRecipeIngredient(this.recipe_content)
      .then(() => history.push('/recipe/' + id))
      .catch((error) => Alert.danger('Creating new recipe: ' + error.message));
  }

  chooseIngredientFunc(id: number) {
    if (id === 0 || id === undefined || id === null || id === NaN) {
      Alert.info('Du må velge en ingrediens');
    } else if (this.recipe_content.some((e) => e.ingred_id == id)) {
      Alert.info('Denne ingrediensen er allerede lagt til');
    } else {
      /* id må være any for å kunne bruke variablen i setattribute. Den forventer to strings så 
    hvis vi hadde deklarert den som number hadde setAttribute blitt sint*/
      // lager en const som legges til i objectet recipe_content
      const add = { oppskrift_id: 0, ingred_id: id, mengde: 0, maleenhet: '' };

      this.recipe_content.push(add);

      // finner index til dette elemetet i objektet, skal brukes senere til å mappe
      // hver enkelt inputfelt til et obejct sin menge eller måleenhet
    }
    this.searchterm = '';
    this.search(this.searchterm);
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

    this.category_name = '';
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
      if (ingredient.ingred_navn.toLowerCase() == this.ingredient.toLowerCase()) {
        return true;
      }
      return false;
    });

    if (!isFound && this.ingredient != '') {
      service
        .createIngredient(this.ingredient)
        .then(() =>
          service
            .getAllIngredient()
            .then(
              (ingredients) => (
                (this.ingredients = ingredients),
                (this.selectedIngredients = ingredients),
                this.chooseIngredientFunc(ingredients[ingredients.length - 1].ingred_id),
                this.search(this.searchterm)
              )
            )
            .catch((error) => Alert.danger('Error : ' + error.message))
        )
        .catch((error) => Alert.danger('Error : ' + error.message));
      this.ingredient = '';
    } else Alert.info('Ingrediensen finnes allerede eller du har ikke skrevet noe');

    this.country_name = '';
  }

  checkCountry(value: number) {
    this.country_id = value;
  }

  checkCategory(value: number) {
    this.category_id = value;
  }
  mounted() {
    this.selectedIngredient.ingred_id = 0;
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
      .then(
        () => (
          (this.ingredients = this.ingredients.sort((a, b) =>
            a.ingred_navn.localeCompare(b.ingred_navn)
          )),
          (this.selectedIngredients = this.selectedIngredients.sort((a, b) =>
            a.ingred_navn.localeCompare(b.ingred_navn)
          ))
        )
      )
      .catch((error) => Alert.danger('Error getting categories: ' + error.message));
  }
}
