import * as React from 'react';
import { Component } from 'react-simplified';
import { Alert, Card, Row, Column, Form, Button, RecipeView } from './widgets';
import { NavLink, Redirect } from 'react-router-dom';
import service, { Country, Category, Ingredient, Recipe, Recipe_Content } from './service';
import { createHashHistory } from 'history';

const history = createHashHistory(); // Use history.push(...) to programmatically change path, for instance after successfully saving a student

/**
 * Renders form to create new recipe.
 */
export class NewRecipe extends Component {
  countries: Country[] = [];
  categories: Category[] = [];
  ingredients: Ingredient[] = [];
  recipe_content: Recipe_Content[] = [];
  ingredient: string = '';

  name: string = '';
  description: string = '';
  steps: string = '';
  portions: number = 0;
  picture_adr: string = '';
  category_id: number = 0;
  category_name: string = '';
  country_id: number = 0;
  country_name: string = '';

  render() {
    console.log(this.categories, this.countries);
    return (
      <>
        <Card title="Registrer en ny oppskrift">
          {/* input navn */}
          <Column>
            <Column width={2}>
              <Form.Label>Name:</Form.Label>
            </Column>
            <Column>
              <Form.Input
                type="text"
                value={this.name}
                onChange={(event) => (this.name = event.currentTarget.value)}
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
                style={{ width: '300px' }}
                type="text"
                value={this.description}
                onChange={(event) => (this.description = event.currentTarget.value)}
                rows={5}
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
                style={{ width: '600px' }}
                type="text"
                value={this.steps}
                onChange={(event) => (this.steps = event.currentTarget.value)}
                rows={10}
              />
            </Column>
          </Column>
          {/* input antall porsjoner */}
          <Column>
            <Column width={2}>
              <Form.Label>Porjsoner:</Form.Label>
            </Column>
            <Column>
              <Form.Input
                type="number"
                value={this.portions}
                onChange={(event) => (this.portions = event.currentTarget.value)}
              />
            </Column>
          </Column>
          {/* input bilde url */}
          <Column>
            <Column width={2}>
              <Form.Label>Bilde url:</Form.Label>
            </Column>
            <Column>
              <Form.Input
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
                id="choseCountry"
                onChange={() => {
                  this.checkCountry(event?.target.value);
                }}
              >
                {/* feilmeldingen kommer fra selected under */}
                {this.countries.map((country: Country, i: number) => (
                  <option key={country.land_id} value={country.land_id}>
                    {country.land_navn}
                  </option>
                ))}
                <option value="0">ikke på liste</option>
              </select>
              <Form.Input
                id="addCountry"
                style={{ opacity: '0', width: '300px' }}
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
                id="choseCategory"
                onChange={() => {
                  this.checkCategory(event?.target.value);
                }}
              >
                {this.categories.map((category: Category) => (
                  <option key={category.kategori_id} value={category.kategori_id}>
                    {category.kategori_navn}
                  </option>
                ))}
                <option value="0">ikke på liste</option>
              </select>
              <Form.Input
                id="addCategory"
                style={{ opacity: '0', width: '300px' }}
                type="text"
                value={this.category_name}
                onChange={(event) => (this.category_name = event.currentTarget.value)}
                placeholder="Skriv inn kattegorien retten tilhører"
              ></Form.Input>
              <Button.Success
                id="addCategoryBtn"
                onClick={() => {
                  this.addIngredientFunc();
                }}
              >
                Legg til
              </Button.Success>
              {/* må lage select og options som cars */}
            </Column>
          </Column>
          {/* print ut alle ingrediense som allerede er i databasen */}
          {/* vidre ideer her er at vi setter en viss lengde og bredde på diven og så hvis den overflower så må man bare skulle 
          nedover, her kan vi også implementere et søkefelt etterhvert for ingredienser. */}
          <Column>
            Ingrediensene som allered er lagret,
            <br /> hvis ingrediensen din ikke er her kan du legge den til!
            <br />
            <Column>
              {this.ingredients.map((ingredient) => (
                <Button.Light
                  id={ingredient.ingred_id}
                  key={ingredient.ingred_id}
                  onClick={() => {
                    this.chooseIngredientFunc(ingredient.ingred_id, ingredient.ingred_navn);
                  }}
                >
                  {ingredient.ingred_navn}
                </Button.Light>
              ))}
            </Column>
          </Column>
          {/* legg til ingredienser */}
          <Column>
            <Form.Input
              id="addIngredient"
              type="text"
              style={{ width: '400px' }}
              value={this.ingredient}
              onChange={(event) => (this.ingredient = event.currentTarget.value)}
              placeholder="Legg til ingredienser"
            ></Form.Input>
            <Button.Success
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
          onClick={() => {
            this.addRecipe();
          }}
        >
          Send oppskriften opp til the database
        </Button.Success>
      </>
    );
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
    };
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
  chooseIngredientFunc(id: any, name: string) {
    const btn = document.getElementById(id) as HTMLButtonElement | null;
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
      this.recipe_content.splice(index, 1);
      btn != null ? (btn.disabled = false) : '';
      emFood.remove();
      inputNumberOf.remove();
      inputMeasurment.remove();
      deleteBtn.remove();
    };

    document.getElementById('ingreditentList').appendChild(emFood);
    document.getElementById('ingreditentList').appendChild(inputNumberOf);
    document.getElementById('ingreditentList').appendChild(inputMeasurment);
    document.getElementById('ingreditentList').appendChild(deleteBtn);
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
      //sender her bare 1 for at TS skal bli fornøyd, funksjonen nedenfor forventer også et tall
      this.checkCountry(1);
    }
  }
  addIngredientFunc() {
    // sjekker om ingrediensen allerede finnes i arrayen med ingredienser
    // hentet fra databasen
    let isFound = this.ingredients.some((ingredient) => {
      console.log(ingredient.ingred_navn == this.ingredient);
      if (ingredient.ingred_navn == this.ingredient) {
        return true;
      }
      return false;
    });

    console.log(isFound);
    if (!isFound && this.ingredient != '') {
      service.createIngredient(this.ingredient).then(() =>
        service
          .getAllIngredient()
          .then((ingredients) => (this.ingredients = ingredients))
          .catch((error) => Alert.danger('Error : ' + error.message))
      );
    }
  }
  checkCountry(value: number) {
    this.country_id = value;
    const addCountry: any = document.getElementById('addCountry');
    value == 0 ? (addCountry.style.opacity = ' 100') : (addCountry.style.opacity = ' 0');
  }

  checkCategory(value: number) {
    this.category_id = value;
    const addCategory: any = document.getElementById('addCategory');
    value == 0 ? (addCategory.style.opacity = ' 100') : (addCategory.style.opacity = ' 0');
  }
  mounted() {
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
      .then((ingredients) => (this.ingredients = ingredients))
      .catch((error) => Alert.danger('Error getting categories: ' + error.message));
  }
}

export class ShowRecipe extends Component<{ match: { params: { id: number } } }> {
  recipe: Recipe = {
    oppskrift_id: 0,
    oppskrift_navn: '',
    oppskrift_beskrivelse: '',
    oppskrift_steg: '',
    ant_pors: 0,
    bilde_adr: '',
    kategori_id: 0,
    land_id: 0,
    ant_like: 0,
  };
  portions: number = 0;
  recipeContent: Recipe_Content[] = [];
  ingredients: Ingredient[] = [];

  render() {
    {
      console.log(this.recipe);
      console.log(this.recipeContent);
      console.log(this.ingredients);
    }

    return (
      <div>
        <Card>
          <img src={this.recipe.bilde_adr}></img>
          <h1>{this.recipe.oppskrift_navn}</h1>
          <p>{this.recipe.oppskrift_beskrivelse}</p>
          <pre>{this.recipe.oppskrift_steg}</pre>
          <h3>Ingredienser</h3>
          Porsjoner <Button.Danger onClick={this.decrementPortions}>-</Button.Danger>{' '}
          <b>{this.portions}</b> <Button.Success onClick={this.incrementPortions}>+</Button.Success>
          {this.recipeContent.map((rc, i) => (
            <p key={i}>
              {i + 1}.{' '}
              {this.ingredients.filter((ing) => rc.ingred_id == ing.ingred_id)[0].ingred_navn}{' '}
              {(rc.mengde * this.portions) / this.recipe.ant_pors} {rc.maleenhet}
            </p>
          ))}
        </Card>
        <Button.Success onClick={() => history.push('/recipe/edit/' + this.recipe.oppskrift_id)}>
          Endre oppskrift
        </Button.Success>
        <Button.Danger onClick={() => this.deleteRecipe(this.recipe.oppskrift_id)}>
          Slett oppskrift
        </Button.Danger>
      </div>
    );
  }

  mounted() {
    service
      .getAllIngredient()
      .then((ingredients) => (this.ingredients = ingredients))
      .catch((error) => Alert.danger('Error getting ingredients: ' + error.message));
    console.log(this.props.match.params.id);
    service
      .getRecipeContent(this.props.match.params.id)
      .then((recipeContent) => (this.recipeContent = recipeContent))
      .catch((error) => Alert.danger('Error getting recipe content: ' + error.message));

    service
      .getRecipe(this.props.match.params.id)
      .then((recipe) => {
        this.recipe = recipe[0];
        this.portions = recipe[0].ant_pors;
      })
      .catch((error) => Alert.danger('Error getting recipe: ' + error.message));
  }
  incrementPortions() {
    this.portions++;
  }
  decrementPortions() {
    if (this.portions > 1) {
      this.portions--;
    }
  }
  deleteRecipe(id: number) {
    service
      .deleteRecipe(id)
      .then(() => history.push('/'))
      .catch((error) => Alert.danger('Error deleting recipe: ' + error.message));
  }
}
export class EditRecipe extends Component<{ match: { params: { id: number } } }> {
  recipe: Recipe = {
    oppskrift_id: 0,
    oppskrift_navn: '',
    oppskrift_beskrivelse: '',
    oppskrift_steg: '',
    ant_pors: 0,
    bilde_adr: '',
    kategori_id: 0,
    land_id: 0,
    ant_like: 0,
  };
  recipeContent: Recipe_Content[] = [];
  ingredients: Ingredient[] = [];

  render() {
    return (
      <>
        <Card title="Endre oppskriften">
          {/* input navn */}
          <Column>
            <Column width={2}>
              <Form.Label>Name:</Form.Label>
            </Column>
            <Column>
              <Form.Input
                type="text"
                value={this.recipe.oppskrift_navn}
                onChange={(event) => (this.recipe.oppskrift_navn = event.currentTarget.value)}
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
                style={{ width: '300px' }}
                type="text"
                value={this.recipe.oppskrift_beskrivelse}
                onChange={(event) =>
                  (this.recipe.oppskrift_beskrivelse = event.currentTarget.value)
                }
                rows={5}
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
                style={{ width: '600px' }}
                type="text"
                value={this.recipe.oppskrift_steg}
                onChange={(event) => (this.recipe.oppskrift_steg = event.currentTarget.value)}
                rows={10}
              />
            </Column>
          </Column>
          {/* input antall porsjoner */}
          <Column>
            <Column width={2}>
              <Form.Label>Porjsoner:</Form.Label>
            </Column>
            <Column>
              <Form.Input
                type="number"
                value={this.recipe.ant_pors}
                //@ts-ignore
                onChange={(event) => (this.recipe.ant_pors = event.currentTarget.value)}
              />
            </Column>
          </Column>
          {/* input bilde url */}
          <Column>
            <Column width={2}>
              <Form.Label>Bilde url:</Form.Label>
            </Column>
            <Column>
              <Form.Input
                type="text"
                value={this.recipe.bilde_adr}
                onChange={(event) => (this.recipe.bilde_adr = event.currentTarget.value)}
              />
            </Column>
          </Column>

          {/* renderer alle ingrediensene som er linket til oppskriften, her kan man også endre på hvor mye det er av hver ingrediens og måleenheten */}
          <Column>
            <div id="outprintIngredient">
              {this.recipeContent.map((rc, i) => (
                <p key={i}>
                  {this.ingredients.filter((ing) => rc.ingred_id == ing.ingred_id)[0].ingred_navn}{' '}
                  <input
                    style={{ width: '50px' }}
                    type="number"
                    value={rc.mengde}
                    onChange={(event) => (
                      //@ts-ignore
                      (rc.mengde = event.currentTarget.value), console.log(this.recipeContent)
                    )}
                  />
                  <input
                    style={{ width: '100px' }}
                    type="text"
                    value={rc.maleenhet}
                    onChange={(event) => (
                      //@ts-ignore
                      (rc.maleenhet = event.currentTarget.value), console.log(this.recipeContent)
                    )}
                  />
                  <Button.Danger
                    onClick={() => this.deleteIngredient(rc.oppskrift_id, rc.ingred_id)}
                  >
                    x
                  </Button.Danger>
                </p>
              ))}{' '}
            </div>
          </Column>
          {/* print ut alle ingrediense som allerede er i databasen */}
          {/* vidre ideer her er at vi setter en viss lengde og bredde på diven og så hvis den overflower så må man bare skulle 
          nedover, her kan vi også implementere et søkefelt etterhvert for ingredienser. */}
          <Column>
            Ingrediensene som allered er lagret,
            <br /> hvis ingrediensen din ikke er her kan du legge den til!
            <br />
            <Column>
              {this.ingredients.map((ingredient) => (
                <>
                  <Button.Light
                    id={ingredient.ingred_id}
                    key={ingredient.ingred_id}
                    onClick={() => {
                      this.addIngredientFunc(ingredient.ingred_id, this.props.match.params.id);
                    }}
                  >
                    {ingredient.ingred_navn}
                  </Button.Light>
                </>
              ))}
            </Column>
          </Column>
        </Card>
        <Button.Success onClick={() => this.pushNewChanges()}>Endre oppskrift</Button.Success>
      </>
    );
  }

  //legger til nye ingredienser, sjekker først om de finnes, så legger den til i databasen og så blir det hentet ned igjen
  addIngredientFunc(ingred_id: number, recipe_id: number) {
    //sjekker om ingrediensen allerede finnes i oppskriften
    const ifExist = this.recipeContent.map((element) =>
      element.ingred_id == ingred_id ? true : false
    );
    //hvis ingrediensen ikke finnes i oppskriften vil den bli lagt til
    if (!ifExist.includes(true)) {
      const add = { oppskrift_id: recipe_id, ingred_id: ingred_id, mengde: 0, maleenhet: '' };

      //gjennbruker .createRecipeIngredient, den forventer et array så pakker da add inn i et array
      service
        .createRecipeIngredient([add])
        .then(() => this.getIngredRecipe())
        .catch((error) => Alert.danger('Error getting ingredients: ' + error.message));
    } else {
      Alert.info('denne ingrediensen finnes allerede i oppskriften');
    }
  }
  //lager en egen funksjon for å hente ingrediensene til en oppskrift fordi jeg bruker den to steder, praktisk
  getIngredRecipe() {
    service
      .getRecipeContent(this.props.match.params.id)
      .then((recipeContent) => (this.recipeContent = recipeContent))
      .catch((error) => Alert.danger('Error getting recipe content: ' + error.message));
  }
  pushNewChanges() {
    console.log('nå sendes objektet', this.recipeContent);
    service
      .updateRecipe(this.recipe)
      .catch((error) => Alert.danger('Error getting ingredients: ' + error.message));
    service
      .updateRecipeIngredient(this.recipeContent)
      .then(() => history.push('/recipe/' + this.props.match.params.id))
      .catch((error) => Alert.danger('Error getting ingredients: ' + error.message));
  }
  deleteIngredient(recipe_id: number, ingred_id: number) {
    service
      .deleteIngredient(recipe_id, ingred_id)
      .then(() => this.getIngredRecipe())
      .catch((error) => Alert.danger('Error getting ingredients: ' + error.message));
  }
  mounted() {
    service
      .getAllIngredient()
      .then((ingredients) => (this.ingredients = ingredients))
      .catch((error) => Alert.danger('Error getting ingredients: ' + error.message));
    console.log(this.props.match.params.id);

    this.getIngredRecipe();

    service
      .getRecipe(this.props.match.params.id)
      .then((recipe) => {
        this.recipe = recipe[0];
      })
      .catch((error) => Alert.danger('Error getting recipe: ' + error.message));
  }
}
