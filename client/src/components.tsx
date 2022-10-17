import * as React from 'react';
import { Component } from 'react-simplified';
import { Alert, Card, Row, Column, Form, Button } from './widgets';
import { NavLink, Redirect } from 'react-router-dom';
import service, { Country, Category, Ingredient, Recipe_Content } from './service';
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
                style={{ width: '600px' }}
                type="text"
                value={this.description}
                onChange={(event) => (this.description = event.currentTarget.value)}
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
                  <option key={country.land_id} value={country.land_id} selected>
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
                  <option key={category.kategori_id} value={category.kategori_id} selected>
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
      </>
    );
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
    deleteBtn.onclick = (id) => {
      this.recipe_content.slice(index);
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
