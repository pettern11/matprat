import * as React from 'react';
import { Component } from 'react-simplified';
import { Alert, Card, CardFull, Row, Column, Form, Button } from '.././widgets';
import Select from 'react-select';
import service, { Ingredient, Recipe, Recipe_Content } from '.././service';
import { createHashHistory } from 'history';

const history = createHashHistory(); // Use history.push(...) to programmatically change path, for instance after successfully saving a student
export class NewRecipe extends Component {
  countries: [{ value: number; label: string }] = [{ value: 0, label: 'Søk på land' }];
  categories: [{ value: number; label: string }] = [{ value: 0, label: 'Søk på kategori' }];
  ingredients: [{ value: number; label: string }] = [{ value: 0, label: 'Søk på ingredienser' }];
  recipe_content: Recipe_Content[] = [];
  ingredient: string = '';
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

  render() {
    return (
      <>
        <div className="margintop">
          {/* input navn */}
          <Row>
            <div className="col-4" style={{ paddingRight: '0px' }}>
              <CardFull title="">
                <h4>Registrer en ny oppskrift</h4>
                <br />
                <div className="col">
                  <Row>
                    <div className="col-4">
                      <p>Navn:</p>
                    </div>
                    <div className="col-8">
                      <Form.Input
                        id="recipe_name_input"
                        type="text"
                        value={this.name}
                        onChange={(event) => (this.name = event.currentTarget.value)}
                        rows={1}
                        style={{ width: '220px' }}
                      />
                    </div>
                  </Row>
                  <br />
                  {/* input beksrivelse */}
                  <Row>
                    <div className="col-4">
                      <p>Beskrivelse:</p>
                    </div>
                    <div className="col-8">
                      <Form.Textarea
                        id="recipe_description_input"
                        type="text"
                        value={this.description}
                        onChange={(event) => (this.description = event.currentTarget.value)}
                        rows={3}
                        style={{ width: '220px' }}
                      />
                    </div>
                  </Row>
                  <br />
                  {/* input bilde url */}
                  <Row>
                    <div className="col-4">
                      <p>Bilde-url:</p>
                    </div>
                    <div className="col-8">
                      <Form.Input
                        id="recipe_picture_url_input"
                        type="text"
                        value={this.picture_adr}
                        onChange={(event) => (this.picture_adr = event.currentTarget.value)}
                        style={{ width: '220px' }}
                      />
                    </div>
                  </Row>
                  <br />
                  {/* input antall porsjoner */}
                  <Row>
                    <div className="col-4">
                      <p>Porsjoner:</p>
                    </div>
                    <div className="col-8">
                      <Form.Input
                        id="recipe_portions_input"
                        type="number"
                        value={this.portions}
                        //@ts-ignore
                        onChange={(event) => (this.portions = event.currentTarget.value)}
                        style={{ width: '220px' }}
                      />
                    </div>
                  </Row>
                  <br />
                  {/* velg retten sin kategori */}
                  <Row>
                    <div className="col-4">
                      <p>Kategori:</p>
                    </div>
                    <div className="col-8">
                      <Select
                        id="choseCategory"
                        options={this.categories}
                        //width="200px" fungerer ikke står i dokumentasjonen at dette er måten å gjøre det på
                        //men det fungerer ikke https://react-select.com/styles
                        onChange={(event) => {
                          //@ts-ignore
                          this.checkCategory(event?.value);
                        }}
                      />
                      <Form.Input
                        id="addCategory"
                        type="text"
                        value={this.category_name}
                        onChange={(event) => (this.category_name = event.currentTarget.value)}
                        placeholder="Skriv inn ny kategori"
                        style={{ width: '220px', marginRight: '0px' }}
                      ></Form.Input>
                      <Button.Success
                        id="addCategoryBtn"
                        onClick={() => {
                          this.addCategoryFunc();
                        }}
                      >
                        Legg til
                      </Button.Success>
                    </div>
                  </Row>
                  <br />
                  {/* velg land retten kommer fra */}
                  <Row>
                    <div className="col-4">
                      <p>Land:</p>
                    </div>
                    <div className="col-8">
                      <Select
                        id="choseCountry"
                        options={this.countries}
                        //width="200px" fungerer ikke står i dokumentasjonen at dette er måten å gjøre det på
                        //men det fungerer ikke https://react-select.com/styles
                        onChange={(event) => {
                          //@ts-ignore
                          this.checkCountry(event?.value);
                        }}
                      />

                      <Form.Input
                        id="addCountry"
                        type="text"
                        value={this.country_name}
                        onChange={(event) => (this.country_name = event.currentTarget.value)}
                        placeholder="Skriv inn nytt land"
                        style={{ width: '220px' }}
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
                    </div>
                  </Row>
                  <br />
                  {/* print ut alle ingrediense som allerede er i databasen */}
                  {/* vidre ideer her er at vi setter en viss lengde og bredde på diven og så hvis den overflower så må man bare skulle 
                   nedover, her kan vi også implementere et søkefelt etterhvert for ingredienser. */}

                  <Row>
                    <div className="col-4">
                      <p>Ingredienser:</p>
                    </div>
                    <div className="col-8">
                      <Select
                        id="choseIngredient"
                        options={this.ingredients}
                        //width="200px" fungerer ikke står i dokumentasjonen at dette er måten å gjøre det på
                        //men det fungerer ikke https://react-select.com/styles
                        onChange={(event) => {
                          //@ts-ignore
                          this.chooseIngredientFunc(event?.value);
                        }}
                      />
                      {/* legg til ingredienser */}
                      <Form.Input
                        id="createIngredient"
                        type="text"
                        style={{ width: '220px' }}
                        value={this.ingredient}
                        onChange={(event) => (this.ingredient = event.currentTarget.value)}
                        placeholder="Skriv inn ny ingrediens"
                      ></Form.Input>
                      <Button.Success
                        id="createIngredientFunc"
                        onClick={() => {
                          this.addIngredientFunc();
                        }}
                      >
                        Legg til
                      </Button.Success>
                    </div>
                  </Row>
                  <br />
                </div>
              </CardFull>
            </div>
            <div className="col-8" style={{ paddingRight: '0px', paddingLeft: '0px' }}>
              <CardFull title="">
                {/* input steg */}
                <div className="col">
                  <Row>
                    <p>Oppskrift:</p>
                    <textarea
                      className="form-control round"
                      id="recipe_steps_input"
                      value={this.steps}
                      onChange={(event) => (this.steps = event.currentTarget.value)}
                    ></textarea>
                    {/* <Form.Textarea
                        id="recipe_steps_input"
                        type="text"
                        value={this.steps}
                        onChange={(event) => (this.steps = event.currentTarget.value)}
                        rows={10}
                        style={{ width: '910px' }}
                      /> */}
                  </Row>
                  <br />
                  {/* velg hvor mye av hver inngrediense */}
                  <Row>
                    <p>Ingredienser:</p>
                    <div
                      id="outprintIngredient"
                      className="scroll round"
                      style={{ backgroundColor: 'white' }}
                    >
                      <div className="col" style={{ width: '' }}>
                        {this.recipe_content.map((rc, i) => (
                          <Row key={i}>
                            <p style={{ width: '215px' }}>
                              {this.ingredients.filter((ing) => rc.ingred_id == ing.value)[0].label}
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
                    </div>
                  </Row>
                </div>
              </CardFull>
            </div>
          </Row>
          <Button.Success
            id="addRecipeBtn"
            onClick={() => {
              this.addRecipe();
            }}
          >
            Lagre oppskrift
          </Button.Success>
        </div>
      </>
    );
  }
  /* Fjerne ingrediens hvis man ikke vil ha den med i oppskriften */
  deleteIngredient(ingred_id: number) {
    //find index of ingred_id in recipeContent
    const index = this.recipe_content.findIndex((element) => element.ingred_id == ingred_id);
    //splice this index from recipeContent
    this.recipe_content.splice(index, 1);
  }

  /* Legge til oppskrift i databasen */
  addRecipe() {
    if (this.picture_adr == '') {
      this.picture_adr = 'https://miro.medium.com/max/1000/1*5DnGR_PQnMR7CkZhvNuMYQ.png';
    }
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
        .catch((error) => Alert.danger('Du mangler å fylle ut noe i oppskriften'));
  }

  /* Legge til ingredienser i databasen */
  addRecipeIngredient(id: number) {
    this.recipe_content.forEach((element) => {
      element.oppskrift_id = id;
    });
    service
      .createRecipeIngredient(this.recipe_content)
      .then(() => history.push('/recipe/' + id))
      .catch((error) => Alert.danger('Creating new recipe: ' + error.message));
  }

  /* Legge til ingredienser i arrayen med ingredienser slik at de ligger klare til å pushes til db */
  chooseIngredientFunc(id: number) {
    if (id === 0 || id === undefined || id === null || id === NaN) {
      Alert.info('Du må velge en ingrediens');
    } else if (this.recipe_content.some((e) => e.ingred_id == id)) {
      Alert.info('Denne ingrediensen er allerede lagt til');
    } else {
      /* id må være any for å kunne bruke variablen i setattribute. Den forventer to strings så 
    hvis vi hadde deklarert den som number hadde setAttribute blitt sint*/
      // lager en const som legges til i objectet recipe_content
      const add = { oppskrift_id: 0, ingred_id: id, mengde: '0', maleenhet: '' };

      this.recipe_content.push(add);

      // finner index til dette elemetet i objektet, skal brukes senere til å mappe
      // hver enkelt inputfelt til et obejct sin menge eller måleenhet
    }
  }

  /* Legge til ny kategori hvis ønsket kategori ikke eksisterer */
  addCategoryFunc() {
    // sjekker om kategorien allerede finnes i arrayen med kategorier, hvis ikke legger den til landet i databasen
    // hentet fra databasen
    let isFound = this.categories.some((category) => {
      if (category.label.toLowerCase() == this.category_name.toLowerCase()) {
        return true;
      }
      return false;
    });

    // hvis kategorien ikke finnes i arrayen med kategorier, legger den til i databasen og oppdaterer arrayen
    const result =
      this.category_name.charAt(0).toUpperCase() + this.category_name.slice(1).toLowerCase();
    this.category_name = result;
    if (!isFound && this.category_name != '') {
      service.createCategory(this.category_name).then(() =>
        service
          .getAllCategory()
          .then((categories) => {
            categories.forEach((element) => {
              this.categories.push({ value: element.kategori_id, label: element.kategori_navn });
            });
          })
          .then(() => {
            return;
          })
          .catch((error) => Alert.danger('Error : ' + error.message))
      );
    }

    this.category_name = '';
  }

  /* Legge til nytt land hvis ønsket land ikke eksisterer */
  addCountryFunc() {
    // sjekker om landet allerede finnes i arrayen med land, hvis ikke legger den til landet i databasen
    // hentet fra databasen

    let isFound = this.countries.some((country) => {
      if (country.label.toLowerCase() == this.country_name.toLowerCase()) {
        return true;
      }
      return false;
    });

    // hvis landet ikke finnes i arrayen med land, legger den til i databasen og oppdaterer arrayen
    const result =
      this.country_name.charAt(0).toUpperCase() + this.country_name.slice(1).toLowerCase();
    this.country_name = result;
    if (!isFound && this.country_name != '') {
      service.createCountry(this.country_name).then(() =>
        service
          .getAllCountry()
          .then((countries) => {
            countries.forEach((element) => {
              this.countries.push({ value: element.land_id, label: element.land_navn });
            });
          })
          .then(() => {
            return;
          })
          .catch((error) => Alert.danger('Error : ' + error.message))
      );
    }
    this.country_name = '';
  }

  /* Legge til ny ingrediens hvis ønsket ingrediens ikke eksisterer */
  addIngredientFunc() {
    // sjekker om ingrediensen allerede finnes i arrayen med ingredienser
    // hentet fra databasen
    let isFound = this.ingredients.some((ingredient) => {
      if (ingredient.label.toLowerCase() == this.ingredient.toLowerCase()) {
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
            .then((ingredients) =>
              ingredients.forEach((element) => {
                this.ingredients.push({ value: element.ingred_id, label: element.ingred_navn });
              })
            )
            .catch((error) => Alert.danger('Error : ' + error.message))
        )
        .catch((error) => Alert.danger('Error : ' + error.message));
      this.ingredient = '';
    } else Alert.info('Ingrediensen finnes allerede eller så har du ikke skrevet noe');

    this.country_name = '';
  }

  /* Setter id-en til landet */
  checkCountry(value: number) {
    this.country_id = value;
  }

  /* Setter id-en til kategorien */
  checkCategory(value: number) {
    this.category_id = value;
  }

  mounted() {
    this.selectedIngredient.ingred_id = 0;
    this.selectedIngredient.ingred_navn = '';

    /* Henter alle landene i databasen og legger de i arrayen */
    service
      .getAllCountry()
      .then((countries) => {
        countries.forEach((element) => {
          this.countries.push({ value: element.land_id, label: element.land_navn });
        });
      })
      .catch((error) => Alert.danger('Error getting countries: ' + error.message));

    /* Henter alle kategoriene i databasen og legger de i arrayen */
    service
      .getAllCategory()
      .then((categories) => {
        categories.forEach((element) => {
          this.categories.push({ value: element.kategori_id, label: element.kategori_navn });
        });
      })
      .catch((error) => Alert.danger('Error getting categories: ' + error.message));

    /* Henter alle ingrediensene i databasen og legger de i arrayen */
    service
      .getAllIngredient()
      .then(
        (ingredients) => (
          ingredients.forEach((element) => {
            this.ingredients.push({ value: element.ingred_id, label: element.ingred_navn });
          }),
          (this.selectedIngredient.ingred_navn = ingredients[0] ? ingredients[0].ingred_navn : ''),
          (this.selectedIngredient.ingred_id = ingredients[0] ? ingredients[0].ingred_id : 0)
        )
      )

      .catch((error) => Alert.danger('Error getting ingredient: ' + error.message));
  }
}
