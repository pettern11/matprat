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
  IceboxIngredient,
} from '.././service';
import { createHashHistory } from 'history';

const history = createHashHistory(); // Use history.push(...) to programmatically change path, for instance after successfully saving a student
export class Icebox extends Component {
  shoppingList: List[] = [];
  ingredients: Ingredient[] = [];
  iceboxIngredients: IceboxIngredient[] = [];
  selectedIngredients: Ingredient[] = [];
  searchterm: string = '';

  selectedIceboxIngredient: IceboxIngredient = {
    ingred_id: 1,
    ingred_navn: '',
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
        <Card title="Dine ingredienser:">
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
            <select
              id="selectExistingIngredient"
              onChange={(event) => {
                this.selectedIceboxIngredient.ingred_id = Number(event.currentTarget.value);

                this.selectedIceboxIngredient.ingred_navn = this.ingredients.filter(
                  (e) => e.ingred_id == this.selectedIceboxIngredient.ingred_id
                )[0].ingred_navn;

                console.log(this.selectedIceboxIngredient.ingred_navn);

                this.homo();
              }}
            >
              {this.selectedIngredients.map((ingredient) => (
                <option key={ingredient.ingred_id} value={ingredient.ingred_id}>
                  {ingredient.ingred_navn}
                </option>
              ))}
            </select>
          </Column>
          <Column>
            {this.iceboxIngredients.map((ingredient) => (
              <Row key={ingredient.ingred_id}>
                <Column width={3}>{ingredient.ingred_navn}</Column>
                <Column width={2}>
                  <Button.Success
                    onClick={() => {
                      this.deleteIceboxIngredients();
                    }}
                  >
                    X
                  </Button.Success>
                </Column>
              </Row>
            ))}
          </Column>
        </Card>
      </>
    );
  }

  mounted() {
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

    service
      .getAllIceboxIngredients()
      .then((iceboxIngredients) => (this.iceboxIngredients = iceboxIngredients))
      .catch((error) => Alert.danger('Error getting tasks: ' + error.message));
  }
  search(searchterm: string) {
    this.selectedIngredients = this.ingredients.filter((ingredient) =>
      ingredient.ingred_navn.toLowerCase().includes(searchterm.toLowerCase())
    );
    this.selectedIngredient.ingred_id = this.selectedIngredients[0].ingred_id;
    console.log(this.selectedIngredients);
  }
  homo() {
    service
      .addIngredientToIcebox(this.selectedIceboxIngredient)
      .then(() => this.mounted())
      .catch((error) => Alert.danger('Error getting ingredients: ' + error.message));
  }
  deleteIceboxIngredient() {}
}
