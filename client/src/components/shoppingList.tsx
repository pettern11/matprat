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
            <div id="liste" className="">
              {this.shoppingList.map((sl, i) => (
                <Row key={i}>
                  <p style={{ width: '190px' }}>
                    {i + 1}.{' '}
                    {
                      this.ingredients.find((ingredient) => ingredient.ingred_id == sl.ingred_id)
                        ?.ingred_navn
                    }{' '}
                    {/* @ts-ignore */}
                  </p>
                  <input
                    className="form-control"
                    type="number"
                    style={{ width: '75px', marginRight: '10px' }}
                    onChange={(event) => {
                      //@ts-ignore
                      sl.mengde = event.currentTarget.value;
                      console.log(sl.mengde);
                    }}
                    onBlur={() => this.updatePortions(sl)}
                    value={sl.mengde}
                    size={2}
                  ></input>{' '}
                  <p style={{ width: '110px' }}>{sl.maleenhet}</p>
                  <Column width={1}>
                    <Button.Danger onClick={() => this.decrementPortions(sl)}>-</Button.Danger>
                  </Column>
                  <Column width={1}>
                    <Button.Success onClick={() => this.incrementPortions(sl)}>+</Button.Success>
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
        <Card title="Legg til ingredienser">
          <Column>
            <p key={1}>
              Navn: {/* @ts-ignore */}
              <Form.Input
                id="navn"
                type="text"
                onChange={(event) => {
                  this.elementHandleliste.ingred_navn = event.currentTarget.value;
                }}
                value={this.elementHandleliste.ingred_navn}
              ></Form.Input>
              Antall: {/* @ts-ignore */}
              <Form.Input
                id="mengde"
                type="number"
                onChange={(event) => {
                  //@ts-ignore
                  this.elementHandleliste.mengde = event.currentTarget.value;
                }}
                value={this.elementHandleliste.mengde}
              ></Form.Input>
              Måleenhet: {/* @ts-ignore */}
              <Form.Input
                id="maleenhet"
                type="text"
                onChange={(event) => {
                  this.elementHandleliste.maleenhet = event.currentTarget.value;
                }}
                value={this.elementHandleliste.maleenhet}
              ></Form.Input>
              <Button.Success onClick={() => this.addItem(this.elementHandleliste)}>
                Legg til
              </Button.Success>
            </p>
          </Column>
        </Card>
        <Card title="Add existing ingredients">
          <Column>
            Søk:
            <Form.Input
              id="shoppinglistsearch"
              type="text"
              value={this.searchterm}
              onChange={(event) => {
                this.search(event.currentTarget.value);
                this.searchterm = event.currentTarget.value;
              }}
            />
            <select
              className="form-select"
              id="selectExistingIngredient"
              onChange={(event) => {
                this.selectedIngredient.ingred_id = Number(event.currentTarget.value);
              }}
            >
              {this.selectedIngredients.map((ingredient) => (
                <option key={ingredient.ingred_id} value={ingredient.ingred_id}>
                  {ingredient.ingred_navn}
                </option>
              ))}
            </select>
          
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
              id="exisitingmaleenhet"
              type="text"
              value={this.selectedIngredient.maleenhet}
              onChange={(event) => {
                this.selectedIngredient.maleenhet = event.currentTarget.value;
                console.log(this.selectedIngredient);
              }}
            />
            <Button.Success onClick={() => this.addExistingItem(this.selectedIngredient)}>
              Legg til
            </Button.Success>
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
      .then(
        (ingredients) => (
          (this.ingredients = ingredients),
          (this.selectedIngredients = ingredients),
          (this.selectedIngredient.ingred_id = document.getElementById('selectExistingIngredient')
            ? //@ts-ignore
              document.getElementById('selectExistingIngredient').value
            : '')
        )
      )
      .catch((error) => Alert.danger('Error getting ingredients: ' + error.message));
  }
  search(searchterm: string) {
    this.selectedIngredients = this.ingredients.filter((ingredient) =>
      ingredient.ingred_navn.toLowerCase().includes(searchterm.toLowerCase())
    );
    if (this.selectedIngredients.length > 0) {
      this.selectedIngredient.ingred_id = this.selectedIngredients[0].ingred_id;
    } else {
      this.selectedIngredient.ingred_id = 0;
      Alert.danger('Ingen ingredienser funnet');
    }
    console.log(this.selectedIngredients);
    console.log(this.selectedIngredient);
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
    console.log(this.ingredients.length);
    console.log(this.ingredients);
    item.ingred_id = this.ingredients[this.ingredients.length - 1].ingred_id + 1;
    if (item.ingred_navn == null || item.ingred_navn == undefined || item.ingred_navn == '') {
      Alert.danger('Du må fylle inn navn på ingrediensen');
    } else if (
      this.ingredients.some(
        (ing) => ing.ingred_navn.toLowerCase() == item.ingred_navn.toLowerCase()
      ) == true
    ) {
      Alert.danger('Ingrediensen eksisterer allerede');
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
      return false;
    } else if (item.maleenhet == null || item.maleenhet == undefined || item.maleenhet == '') {
      Alert.danger('Du må fylle inn måleenhet');
      return false;
    } else {
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
      item.maleenhet = 'stk';
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
