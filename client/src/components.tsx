import * as React from 'react';
import { Component } from 'react-simplified';
import { Alert, Card, Row, Column, Form, Button, RecipeView } from './widgets';
import { NavLink, Redirect } from 'react-router-dom';
import service, {
  Country,
  Category,
  Ingredient,
  Recipe,
  Recipe_Content,
  List,
  ElementShoppingList,
} from './service';
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
                id="recipe_name_input"
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
                id="recipe_description_input"
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
                id="recipe_steps_input"
                style={{ width: '600px' }}
                type="text"
                value={this.steps}
                onChange={(event) => (this.steps = event.currentTarget.value)}
                rows={5}
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
                id="recipe_portions_input"
                type="number"
                value={this.portions}
                //@ts-ignore
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
                  id={'ingred' + ingredient.ingred_id}
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
  chooseIngredientFunc(id: any, name: string) {
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
    const ingredList = document.getElementById('ingreditentList') || document.createElement('div');
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

    ingredList.appendChild(emFood);
    ingredList.appendChild(inputNumberOf);
    ingredList.appendChild(inputMeasurment);
    ingredList.appendChild(deleteBtn);
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
            .then((ingredients) => (this.ingredients = ingredients))
            .catch((error) => Alert.danger('Error : ' + error.message))
        )
        .catch((error) => Alert.danger('Error : ' + error.message));
    } else Alert.info('Ingrediensen finnes allerede eller du har ikke skrevet noe');
  }
  checkCountry(value: number) {
    this.country_id = value;
  }

  checkCategory(value: number) {
    this.category_id = value;
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

export class LikedRecipes extends Component {
  likedList: List[] = [];
  originalrecipes: Recipe[] = [];
  recipes: Recipe[] = [];

  render() {
    return (
      <Card title="Likede oppskrifter">
        {this.recipes
          .filter((recipe) => recipe.liked == true)
          .map((likedRecipe) => (
            <Card title="" key={likedRecipe.oppskrift_id}>
              <NavLink className="black" to={'/recipe/' + likedRecipe.oppskrift_id}>
                <RecipeView
                  img={likedRecipe.bilde_adr}
                  name={likedRecipe.oppskrift_navn}
                  numbOfPors={likedRecipe.ant_pors}
                ></RecipeView>
              </NavLink>
            </Card>
          ))}
      </Card>
    );
  }

  mounted() {
    service
      .getAllRepice()
      .then((recipes) => {
        this.originalrecipes = recipes;
        this.recipes = recipes;
      })
      .catch((error) => Alert.danger('Error getting tasks: ' + error.message));
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
    liked: false,
  };
  portions: number = 0;
  recipeContent: Recipe_Content[] = [];
  ingredients: Ingredient[] = [];
  categories: Category[] = [];
  //liked: boolean = this.recipe.liked;

  render() {
    return (
      <div>
        <Card title="">
          <img src={this.recipe.bilde_adr} width="20px"></img>
          <h1>{this.recipe.oppskrift_navn}</h1>
          <p>Beskrivelse: {this.recipe.oppskrift_beskrivelse}</p>
          <p>
            Kategori:{' '}
            {
              this.categories.find((kategori) => kategori.kategori_id == this.recipe.kategori_id)
                ?.kategori_navn
            }
          </p>
          <p>Antall likes: {this.recipe.ant_like}</p>
          <Form.Checkbox
            checked={this.recipe.liked}
            id="checkbox"
            onChange={() => {
              service.likeRecipe(this.recipe.oppskrift_id, !this.recipe.liked).then(() => {
                ShowRecipe.instance()?.mounted();
              });
            }}
          />
          <label htmlFor="checkbox" id="heart">
            test
          </label>
          <h5>Oppskrift:</h5>
          <pre>{this.recipe.oppskrift_steg}</pre>
          <h3>Ingredienser</h3>
          Porsjoner <Button.Danger onClick={this.decrementPortions}>-</Button.Danger>{' '}
          <b>{this.portions}</b> <Button.Success onClick={this.incrementPortions}>+</Button.Success>
          {this.recipeContent.map((rc, i) => (
            <p key={i}>
              {i + 1}.{' '}
              {this.ingredients.filter((ing) => rc.ingred_id == ing.ingred_id)[0].ingred_navn}{' '}
              {((rc.mengde * this.portions) / this.recipe.ant_pors).toFixed(1)} {rc.maleenhet}
            </p>
          ))}
        </Card>
        <Button.Success onClick={() => history.push('/recipe/edit/' + this.props.match.params.id)}>
          Endre oppskrift
        </Button.Success>
        <Button.Danger
          id="deleteRecipe"
          onClick={() => this.deleteRecipe(this.props.match.params.id)}
        >
          Slett oppskrift
        </Button.Danger>
        <Button.Success onClick={this.ingredientsToShoppingList}>
          Send ingredienser til handleliste
        </Button.Success>
      </div>
    );
  }

  mounted() {
    service
      .getAllIngredient()
      .then((ingredients) => (this.ingredients = ingredients))
      .catch((error) => Alert.danger('Error getting ingredients: ' + error.message));

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

    service
      .getAllCategory()
      .then((categories) => (this.categories = categories))
      .catch((error) => Alert.danger('Error getting categories: ' + error.message));
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
  ingredientsToShoppingList() {
    this.recipeContent.forEach((rc) => {
      const ingredient = {
        ingred_id: rc.ingred_id,
        mengde: (rc.mengde * this.portions) / this.recipe.ant_pors,
        maleenhet: rc.maleenhet,
      };
      service.addIngredient(ingredient);
    });
    history.push('/shoppinglist');
  }
  updateAntLikes() {
    if (this.recipe.liked == true) {
      this.recipe.ant_like++;
    } else {
      this.recipe.ant_like--;
    }
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
    liked: false,
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

export class ShoppingList extends Component {
  shoppingList: List[] = [];
  ingredients: Ingredient[] = [];
  selectedIngredients: Ingredient[] = [];
  searchterm: string = '';
  elementHandleliste: ElementShoppingList = {
    ingred_id: 0,
    ingred_navn: '',
    mengde: 0,
    maleenhet: '',
  };
  selectedIngredient: List = {
    id: 0,
    ingred_id: 1,
    mengde: 0,
    maleenhet: '',
  };

  render() {
    return (
      <>
        <Card title="Handleliste">
          <Column>
            {this.shoppingList.map((sl, i) => (
              <p key={i}>
                {i + 1}.{' '}
                {
                  this.ingredients.find((ingredient) => ingredient.ingred_id == sl.ingred_id)
                    ?.ingred_navn
                }{' '}
                <input
                  id="mengde"
                  type="string"
                  onChange={(event) => {
                    //@ts-ignore
                    sl.mengde = event.currentTarget.value;
                    console.log(sl.mengde);
                  }}
                  value={sl.mengde}
                  size={2}
                ></input>{' '}
                {sl.maleenhet}
                <Button.Danger onClick={() => this.deleteIngredient(sl.id)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-trash"
                    viewBox="0 0 16 16"
                  >
                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                    <path
                      fillRule="evenodd"
                      d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
                    />
                  </svg>
                </Button.Danger>
                <Button.Success onClick={() => this.updatePortions(sl)}>
                  Endre antall
                </Button.Success>
                <Button.Danger onClick={() => this.decrementPortions(sl)}>-</Button.Danger>
                <Button.Success onClick={() => this.incrementPortions(sl)}>+</Button.Success>
              </p>
            ))}
            <Button.Danger onClick={() => this.deleteAll()}>Slett alle</Button.Danger>
          </Column>
        </Card>
        <Card title="Legg til ingredienser">
          <Column>
            <p key={1}>
              Navn:{' '}
              <input
                id="navn"
                type="text"
                onChange={(event) => {
                  this.elementHandleliste.ingred_navn = event.currentTarget.value;
                }}
                value={this.elementHandleliste.ingred_navn}
              ></input>
              Antall:{' '}
              <input
                id="mengde"
                type="number"
                step=".01"
                onChange={(event) => {
                  //@ts-ignore
                  this.elementHandleliste.mengde = event.currentTarget.value;
                }}
                value={this.elementHandleliste.mengde}
              ></input>
              Måleenhet:{' '}
              <input
                id="maleenhet"
                type="text"
                onChange={(event) => {
                  this.elementHandleliste.maleenhet = event.currentTarget.value;
                }}
                value={this.elementHandleliste.maleenhet}
              ></input>
              <Button.Success onClick={() => this.addItem(this.elementHandleliste)}>
                Legg til
              </Button.Success>
            </p>
          </Column>
        </Card>
        <Card title="Add existing ingredients">
          <Column>
          <h6>Søk</h6>
        <Form.Input
            id="shoppinglistsearch"
            type="text"
            value={this.searchterm}
            onChange={(event) => {
              this.search(event.currentTarget.value);
              this.searchterm = event.currentTarget.value;
            }}
          />
          <select id="selectExistingIngredient" onChange={(event) => {this.selectedIngredient.ingred_id = Number(event.currentTarget.value);}}>
            {this.selectedIngredients.map((ingredient) => (
              <option key={ingredient.ingred_id} value={ingredient.ingred_id}>
                {ingredient.ingred_navn}
              </option>
            ))}
          </select>
          <br/>
          Antall: <Form.Input id="mengde" type="number"  value={this.selectedIngredient.mengde} onChange={(event) => {this.selectedIngredient.mengde = event.currentTarget.value}}/>
          Måleenhet: <Form.Input id="maleenhet" type="text" value={this.selectedIngredient.maleenhet} onChange={(event) => {this.selectedIngredient.maleenhet = event.currentTarget.value; console.log(this.selectedIngredient)}}/>
          <Button.Success onClick={() => this.addExistingItem(this.selectedIngredient)}>Legg til</Button.Success>
        </Column>
        </Card>
      </>
    );
  }

  mounted() {
    this.elementHandleliste.ingred_id = 0;
    this.elementHandleliste.ingred_navn = '';
    this.elementHandleliste.mengde = 0;
    this.elementHandleliste.maleenhet = '';

    this.searchterm = '';
    this.selectedIngredient.mengde = 0;
    this.selectedIngredient.maleenhet = '';

    service
      .getShoppingList()
      .then((shoppingList: List[]) => (this.shoppingList = shoppingList))
      .catch((error: { message: string }) =>
        Alert.danger('Error getting shoppingList: ' + error.message)
      );

    service
      .getAllIngredient()
      .then((ingredients) => (this.ingredients = ingredients, this.selectedIngredients = ingredients, this.selectedIngredient.ingred_id = document.getElementById('selectExistingIngredient')?document.getElementById('selectExistingIngredient').value:''))
      .catch((error) => Alert.danger('Error getting ingredients: ' + error.message));
  }
  search(searchterm: string) {
    this.selectedIngredients = this.ingredients.filter((ingredient) =>
      ingredient.ingred_navn.toLowerCase().includes(searchterm.toLowerCase())
    );
    this.selectedIngredient.ingred_id = this.selectedIngredients[0].ingred_id;
    console.log(this.selectedIngredients);
  }
  incrementPortions(ingredient: List) {
    ingredient.mengde++;
    service
      .updateIngredientShoppingList(ingredient)
      .then(() => this.mounted())
      .catch((error) => Alert.danger('Error getting ingredients: ' + error.message));
  }
  decrementPortions(ingredient: List) {
    if (ingredient.mengde > 1) {
      ingredient.mengde--;
      service
        .updateIngredientShoppingList(ingredient)
        .then(() => this.mounted())
        .catch((error) => Alert.danger('Error getting ingredients: ' + error.message));
    }
  }
  updatePortions(ingredient: List) {
    //@ts-ignore
    if (
      ingredient.mengde < 0 ||
      ingredient.mengde == null ||
      ingredient.mengde == undefined ||
      //@ts-ignore
      ingredient.mengde == ''
    ) {
      ingredient.mengde = 1;
    }
    service
      .updateIngredientShoppingList(ingredient)
      .then(() => this.mounted())
      .then(() => Alert.info('Antall oppdatert'))
      .catch((error) => Alert.danger('Error getting ingredients: ' + error.message));
  }

  deleteIngredient(id: number) {
    service
      .deleteIngredientShoppingList(id)
      .then(() => this.mounted())
      .catch((error) => Alert.danger('Error getting ingredients: ' + error.message));
  }

  deleteAll() {
    service
      .deleteAllShoppingList()
      .then(() => this.mounted())
      .catch((error) => Alert.danger('Error deleting shopping list: ' + error.message));
  }

  addItem(item: ElementShoppingList) {
    console.log(this.ingredients.length)
    console.log(this.ingredients)
    item.ingred_id = this.ingredients[this.ingredients.length-1].ingred_id+1;
    if (item.ingred_navn == null || item.ingred_navn == undefined || item.ingred_navn == '') {
      Alert.danger('Du må fylle inn navn på ingrediensen');
    } else if (
      this.ingredients.some(
        (ing) => ing.ingred_navn.toLowerCase() == item.ingred_navn.toLowerCase()
      ) == true
    ) {
      Alert.danger('Ingrediensen finnes eksisterer allerede');
    } else if (
      item.mengde == null ||
      item.mengde == undefined ||
      //@ts-ignore
      item.mengde == '' ||
      item.mengde < 0 ||
      item.mengde == 0
    ) {
      item.mengde = 1;
      Alert.danger('Du må fylle inn antall av ingrediensen, dette må være heltall større enn 0');
    } else if (item.maleenhet == null || item.maleenhet == undefined || item.maleenhet == '') {
      Alert.danger('Du må fylle inn måleenhet');
    }  else {
      service
        .createIngredient(item.ingred_navn)
        .then(() => {
          service
            .addIngredient(item)
            .then(() => this.mounted())
            .catch((error) => Alert.danger('Error adding item to shopping list: ' + error.message));
        })
        .catch((error) => Alert.danger('Error creating new ingredient: ' + error.message));
    } 
  }

  addExistingItem(item: List) {
    if (item.mengde == null || item.mengde == undefined || 
      //@ts-ignore
      item.mengde == '' || item.mengde < 0) {
      item.mengde = 1;
      Alert.danger('Du må fylle inn antall av ingrediensen, dette må være heltall større enn 0');
    } else if (item.maleenhet == null || item.maleenhet == undefined || item.maleenhet == '') {
      item.maleenhet = 'stk';
      Alert.danger('Du må fylle inn måleenhet');
    } else if (item.ingred_id == 0 || item.ingred_id < 0 || item.ingred_id == null || item.ingred_id == undefined) {
      Alert.danger('Du må velge en ingrediens');
    }
    else {
      service
            .addIngredient(item)
            .then(() => this.mounted())
            .catch((error) => Alert.danger('Error adding item to shopping list: ' + error.message));
    }
  }
}

