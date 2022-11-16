import * as React from 'react';
import { Component } from 'react-simplified';
import { Alert, Card, CardFull, Row, Column, Form, Button } from '.././widgets';
import service, { Ingredient, List, ElementShoppingList } from '.././service';
import { createHashHistory } from 'history';
import Select from 'react-select';

const history = createHashHistory(); // Use history.push(...) to programmatically change path, for instance after successfully saving a student
export class ShoppingList extends Component {
  newIngredient: string = '';
  shoppingList: List[] = [];
  ingredients: [{ value: number; label: string }] = [{ value: 0, label: 'Søk på ingredienser' }];
  selectedIngredient: List = {
    id: 0,
    ingred_id: 0,
    mengde: '',
    maleenhet: '',
  };
  render() {
    return (
      <>
        <div className="margintop">
          <Row>
            <div className="col-4" style={{ paddingRight: '0px' }}>
              {/* card hvor man kan legge til ingredienser i handlelisten */}
              <CardFull title="Legg til varer i kurven din">
                <Column>
                  Søk:
                  <Select
                    id="choseIngredient"
                    options={this.ingredients}
                    onChange={(event) => {
                      this.selectedIngredient.ingred_id = Number(event?.value);
                    }}
                  />
                  <br />
                  Antall:{' '}
                  <Form.Input
                    id="exisitingmengde"
                    type="number"
                    value={this.selectedIngredient.mengde}
                    onChange={(event) => {
                      //@ts-ignore
                      this.selectedIngredient.mengde = event.currentTarget.value;
                    }}
                  />
                  <br />
                  Måleenhet:{' '}
                  <Form.Input
                    placeholder="Skriv inn måleenhet"
                    id="exisitingmaleenhet"
                    type="text"
                    value={this.selectedIngredient.maleenhet}
                    onChange={(event) => {
                      this.selectedIngredient.maleenhet = event.currentTarget.value;
                    }}
                  />
                  <br />
                  <Button.Success
                    onClick={() => {
                      this.addExistingItem(this.selectedIngredient);
                    }}
                  >
                    Legg til
                  </Button.Success>
                  <br />
                  <br />
                  {/* muligheten for å legge til nye ingredienser som ikke allerede finnes */}
                  Legg til ny vare:
                  <Form.Input
                    id="createIngredient"
                    type="text"
                    style={{ width: '210px' }}
                    value={this.newIngredient}
                    onChange={(event) => (this.newIngredient = event.currentTarget.value)}
                    placeholder="Skriv inn ny vare"
                  ></Form.Input>
                  <Button.Success
                    id="createIngredientFunc"
                    onClick={() => {
                      this.addIngredient(this.newIngredient);
                    }}
                  >
                    Legg til
                  </Button.Success>
                </Column>
              </CardFull>
            </div>

            <div className="col-8" style={{ padding: '0px' }}>
              {/* card hvor handlelisten vises med alle ingrediensene */}
              <CardFull title="Handleliste">
                <div className="col">
                  <div id="liste" className="scrollbig">
                    {this.shoppingList.map((sl, i) => (
                      <Row key={sl.ingred_id + 'a' + i}>
                        <p style={{ width: '190px' }}>
                          {'• '}
                          {
                            this.ingredients.find((ingredient) => ingredient.value == sl.ingred_id)
                              ?.label
                          }{' '}
                        </p>
                        <Form.Input
                          className="form-control"
                          type="number"
                          style={{ width: '75px', marginRight: '5px', paddingRight: '0px' }}
                          onChange={(event) => {
                            sl.mengde = event.currentTarget.value;
                          }}
                          onBlur={() => this.update(sl)}
                          value={sl.mengde}
                          size={2}
                        ></Form.Input>{' '}
                        <p style={{ width: '110px', paddingLeft: '0px' }}>{sl.maleenhet}</p>
                        <p style={{ width: '45px', marginTop: '0px', marginBottom: '0px' }}>
                          <Button.Danger onClick={() => this.decrement(sl)}>-</Button.Danger>
                        </p>
                        <p style={{ width: '49px', marginTop: '0px', marginBottom: '0px' }}>
                          <Button.Success onClick={() => this.increment(sl)}>+</Button.Success>
                        </p>
                        <p style={{ width: '45px', marginTop: '0px', marginBottom: '0px' }}>
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
                        </p>
                      </Row>
                    ))}
                  </div>
                  <br />
                  <Button.Danger onClick={() => this.deleteAll()}>Slett alle</Button.Danger>
                </div>
              </CardFull>
            </div>
          </Row>
        </div>
      </>
    );
  }

  mounted() {
    this.selectedIngredient.mengde = '0';
    this.selectedIngredient.maleenhet = '';
    //henter inn alle ingredientene fra databasen
    service
      .getAllIngredient()
      .then((ingredients) =>
        ingredients.forEach((element) => {
          this.ingredients.push({ value: element.ingred_id, label: element.ingred_navn });
        })
      )
      .catch((error) => Alert.danger('Error getting ingredients: ' + error.message));

    //henter inn alle ingrediensene fra handlelisten
    service
      .getShoppingList()
      .then((shoppingList: List[]) => (this.shoppingList = shoppingList))
      .catch((error: { message: string }) =>
        Alert.danger('Error getting shoppingList: ' + error.message)
      );
  }
  //metode for å inknrementere antall av hva du skal ha i handlelisten
  increment(ingredient: List) {
    ingredient.mengde++;
    service
      .updateIngredientShoppingList(ingredient)
      .catch((error) => Alert.danger('Error increment shoppinlist count: ' + error.message));
  }
  //metode for å dekremenere antall av hva du skal ha i handlelisten
  decrement(ingredient: List) {
    if (Number(ingredient.mengde) > 1) {
      ingredient.mengde = (Number(ingredient.mengde) - 1).toString();
      service
        .updateIngredientShoppingList(ingredient)
        .catch((error) => Alert.danger('Error decrement shoppinglist count: ' + error.message));
    }
  }
  //metode for å oppdatere antall av hva du skal ha i handlelisten
  update(ingredient: List) {
    if (
      Number(ingredient.mengde) < 0 ||
      ingredient.mengde == null ||
      ingredient.mengde == undefined ||
      ingredient.mengde == ''
    ) {
      ingredient.mengde = '1';
    }
    service
      .updateIngredientShoppingList(ingredient)
      .then(() => Alert.info('Antall oppdatert'))
      .catch((error) => Alert.danger('Error getting ingredients: ' + error.message));
  }
  //sletter ingrediens fra handlelisten
  deleteIngredient(id: number) {
    service
      .deleteIngredientShoppingList(id)
      .then(() => {
        this.shoppingList = this.shoppingList.filter((sl) => sl.id !== id);
      })
      .catch((error) => Alert.danger('Error getting ingredients: ' + error.message));
  }
  //sletter alle ingrediense fra handlelisten
  deleteAll() {
    service
      .deleteAllShoppingList()
      .then(() => (this.shoppingList = []))
      .catch((error) => Alert.danger('Error deleting shopping list: ' + error.message));
  }
  //metode for å lage nye ingredienser
  addIngredient(item: string) {
    if (item == null || item == undefined || item == '') {
      Alert.danger('Du må fylle inn navn på ingrediensen');
    } else if (
      this.ingredients.some((ing) => ing.label.toLowerCase() == item.toLowerCase()) == true
    ) {
      Alert.danger('Ingrediensen eksisterer allerede');
    }
    //hvis ingrediensen ikke eksisterer fra før, er utdefinert, null eller en tom string så legges den til i databasen
    else {
      this.newIngredient = '';
      service
        .createIngredient(item)
        .then(() => {
          service.getAllIngredient().then((ingredients) =>
            ingredients.forEach((element) => {
              this.ingredients.push({ value: element.ingred_id, label: element.ingred_navn });
            })
          );
        })
        .catch((error) => Alert.danger('Error creating new ingredient: ' + error.message));
    }
  }
  //metode for å legge til ingredienser i handlelisten
  addExistingItem(item: List) {
    if (item.ingred_id == 0 || item.ingred_id == undefined) {
      Alert.danger('Du må velge en ingrediens');
    }
    //i løsningen vår har vi bestemt oss for å ha med antall og måleenhet av hva du skal kjøpe. Du kan valgritt velge om du vil ha med dette
    else {
      service
        .addIngredient(item)

        .then(() => this.mounted())
        .catch((error) => Alert.danger('Error adding item to shopping list: ' + error.message));
    }
  }
}
