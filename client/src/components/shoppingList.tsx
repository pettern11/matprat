// @ts-nocheck
import * as React from 'react';
import { Component } from 'react-simplified';
import { Alert, Card, Row, Column, Form, Button } from '.././widgets';
import service, {
  Ingredient,
  List,
  ElementShoppingList,
} from '.././service';
import { createHashHistory } from 'history';
import Select from 'react-select';

const history = createHashHistory(); // Use history.push(...) to programmatically change path, for instance after successfully saving a student
export class ShoppingList extends Component {
  newIngredient: string = '';
  shoppingList: List[] = [];
  ingredients: [{ value: number; label: string }] = [{ value: 0, label: 'Søk på ingredienser' }];
  selectedIngredients: Ingredient[] = [];
  searchterm: string = '';
  elementHandleliste: ElementShoppingList = {
    ingred_id: 0,
    ingred_navn: '',
    mengde: '',
    maleenhet: '',
  };
  selectedIngredient: List = {
    id: 0,
    ingred_id: 1,
    mengde: '',
    maleenhet: '',
  };
  render() {
    return (
      <>
        <div className="margintop">
          <Row>
            <div className="col" style={{ width: '50%', height: '100%', paddingRight: '0px' }}>
              <Card title="Legg til varer i kurven din">
                <Column>
                  Søk:
                  <Select
                    id="choseIngredient"
                    options={this.ingredients}
                    //width="200px" fungerer ikke står i dokumentasjonen at dette er måten å gjøre det på
                    //men det fungerer ikke https://react-select.com/styles
                    onChange={(event) => {
                      console.log(event.value);
                      this.selectedIngredient.ingred_id = Number(event.value);
                    }}
                  />
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
                  <Button.Success
                    onClick={() => {
                      console.log(this.selectedIngredient),
                        this.addExistingItem(this.selectedIngredient);
                    }}
                  >
                    Legg til
                  </Button.Success>
                </Column>
              </Card>
              <Card title="Legg til ny vare">
                <Column>
                  <Form.Input
                    id="createIngredient"
                    type="text"
                    style={{ width: '280px' }}
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
                  {/* <div style={{ width: '690px' }}></div> */}
                </Column>
              </Card>
              {/* </div > */}
            </div>
            <div className="col" style={{ width: '50%', height: '100%', padding: '0px' }}>
              <Card title="Handleliste">
                <Column>
                  <div id="liste" className="">
                    {this.shoppingList.map((sl, i) => (
                      <Row key={sl.ingred_id + 'a' + i}>
                        {/* <Row> */}
                        <p style={{ width: '190px' }}>
                          {i + 1}.{' '}
                          {
                            this.ingredients.find((ingredient) => ingredient.value == sl.ingred_id)
                              ?.label
                          }{' '}
                          {/* @ts-ignore */}
                        </p>
                        <Form.Input
                          className="form-control"
                          type="number"
                          style={{ width: '75px', marginRight: '10px' }}
                          onChange={(event) => {
                            sl.mengde = event.currentTarget.value;
                          }}
                          onBlur={() => this.updatePortions(sl)}
                          value={sl.mengde}
                          size={2}
                        ></Form.Input>{' '}
                        <p style={{ width: '110px' }}>{sl.maleenhet}</p>
                        <Column width={1}>
                          <Button.Danger onClick={() => this.decrementPortions(sl)}>
                            -
                          </Button.Danger>
                        </Column>
                        <Column width={1}>
                          <Button.Success onClick={() => this.incrementPortions(sl)}>
                            +
                          </Button.Success>
                        </Column>
                        <Column width={1}>
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
                        </Column>
                      </Row>
                    ))}
                    <Button.Danger onClick={() => this.deleteAll()}>Slett alle</Button.Danger>
                  </div>
                </Column>
              </Card>
            </div>
          </Row>
        </div>
      </>
    );
  }

  mounted(search: string, jk: boolean) {
    this.searchterm = search;
    this.selectedIngredient.mengde = 0;
    this.selectedIngredient.maleenhet = '';

    service
      .getAllIngredient()
      .then((ingredients) =>
        ingredients.forEach((element) => {
          this.ingredients.push({ value: element.ingred_id, label: element.ingred_navn });
        })
      )

      .catch((error) => Alert.danger('Error getting ingredients: ' + error.message));
    service
      .getShoppingList()
      .then((shoppingList: List[]) => (this.shoppingList = shoppingList))
      .catch((error: { message: string }) =>
        Alert.danger('Error getting shoppingList: ' + error.message)
      );
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
    if (
      ingredient.mengde < 0 ||
      ingredient.mengde == null ||
      ingredient.mengde == undefined ||
      ingredient.mengde == ''
    ) {
      ingredient.mengde = 1;
    }
    service
      .updateIngredientShoppingList(ingredient)
      .then(() => {
        this.mounted();
      })
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

  addIngredient(item: string) {
    if (item == null || item == undefined || item == '') {
      Alert.danger('Du må fylle inn navn på ingrediensen');
    } else if (
      this.ingredients.some((ing) => ing.label.toLowerCase() == item.toLowerCase()) == true
    ) {
      Alert.danger('Ingrediensen eksisterer allerede');
    } else {
      this.newIngredient = '';
      service
        .createIngredient(item)
        //sender parametere inn i mounted for å søke på ingrediensen når mounted er ferdig
        //dette virker mest praktisk fordi componentDidMount og componentDidUpdate ikke fungerte
        .then(() => {
          this.mounted(item, true);
        })

        .catch((error) => Alert.danger('Error creating new ingredient: ' + error.message));
    }
  }

  addExistingItem(item: List) {
    if (
      item.mengde == null ||
      item.mengde == undefined ||
      //@ts-ignore
      item.mengde == '' ||
      item.mengde < 0
    ) {
      item.mengde = 1;
      Alert.danger('Du må fylle inn antall av ingrediensen, dette må være heltall større enn 0');
    } else if (item.maleenhet == null || item.maleenhet == undefined || item.maleenhet == '') {
      // item.maleenhet = 'stk';
      Alert.danger('Du må fylle inn måleenhet');
    } else if (
      item.ingred_id == 0 ||
      item.ingred_id < 0 ||
      item.ingred_id == null ||
      item.ingred_id == undefined
    ) {
      Alert.danger('Du må velge en ingrediens');
    } else {
      service
        .addIngredient(item)
        .then(() => this.mounted())
        .catch((error) => Alert.danger('Error adding item to shopping list: ' + error.message));
    }
  }
}
