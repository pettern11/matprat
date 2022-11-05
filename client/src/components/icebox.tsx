import * as React from 'react';
import { Component } from 'react-simplified';
import { Alert, Card, Row, Column, Form, Button, RecipeView, Cards } from '.././widgets';
import { NavLink } from 'react-router-dom';
import service, { Ingredient, Recipe, Recipe_Content, List } from '.././service';

export class Icebox extends Component {
  ingredients: Ingredient[] = [];
  selectedIngredients: Ingredient[] = [];
  recipes: Recipe[] = [];
  filteredRecipes: Recipe[] = [];
  recipeContent: Recipe_Content[] = [];
  choosenIngredient: Ingredient[] = [];

  searchterm: string = '';
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
              className="form-select"
              id="selectExistingIngredient"
              onChange={(event) => {
                let id = Number(event.target.value);
                //find name of ingredient
                let name =
                  this.selectedIngredients.find((e) => e.ingred_id == id)?.ingred_navn || '';
                this.addIngredientToIcebox(id, name);
              }}
            >
              {this.selectedIngredients.map((ingredient, idx) => (
                <option key={idx} value={ingredient.ingred_id}>
                  {ingredient.ingred_navn}
                </option>
              ))}
            </select>
          </Column>
          <Column>
            {this.choosenIngredient.map((ingredient, idx) => (
              <Row key={idx}>
                <p style={{ width: '150px' }}>{ingredient.ingred_navn}</p>
                <Column width={2}>
                  <Button.Success
                    onClick={() => {
                      this.deleteIceboxIngredient(ingredient.ingred_id);
                    }}
                  >
                    X
                  </Button.Success>
                </Column>
              </Row>
            ))}
          </Column>
        </Card>
        <Card title="Oppskrifter basert på dine ingredienser">
          <Row>
            <>
              {this.filteredRecipes.map((recipe, idx) => (
                <Cards title="" key={idx}>
                  <NavLink className="black" to={'/recipe/' + recipe.oppskrift_id}>
                    <RecipeView
                      img={recipe.bilde_adr}
                      name={recipe.oppskrift_navn}
                      numbOfPors={recipe.ant_pors}
                    ></RecipeView>
                  </NavLink>
                </Cards>
              ))}
            </>
          </Row>
        </Card>
      </>
    );
  }

  addIngredientToIcebox(id: number, name: string) {
    let add = { ingred_id: id, ingred_navn: name };
    service
      .addIngredientToIcebox(add)
      .then(() => (this.choosenIngredient.push(add), this.filterRecipes()))
      .catch((error) => Alert.danger('Error, ingredient already added: ' + error.message));
  }
  deleteIceboxIngredient(id: number) {
    service
      .deleteIceboxIngredient(id)
      .then(
        () => (
          (this.choosenIngredient = this.choosenIngredient.filter((e) => e.ingred_id != id)),
          this.filterRecipes()
        )
      )
      .catch((error) => Alert.danger('Error deleting icebox ingredient: ' + error.message));
  }

  filterRecipes() {
    //filter recipes based on choosen ingredients
    //the recipe will be added to filteredRecipes if one of the ingredients in the recipe is in choosenIngredient
    this.filteredRecipes = [];
    this.recipes.forEach((recipe) => {
      this.recipeContent.forEach((recipeContent) => {
        if (recipe.oppskrift_id == recipeContent.oppskrift_id) {
          this.choosenIngredient.forEach((ingredient) => {
            if (ingredient.ingred_id == recipeContent.ingred_id) {
              this.filteredRecipes.push(recipe);
            }
          });
        }
      });
    });
  }
  search(searchterm: string) {
    this.selectedIngredients = this.ingredients.filter((ingredient) =>
      ingredient.ingred_navn.toLowerCase().includes(searchterm.toLowerCase())
    );
    this.selectedIngredient.ingred_id = this.selectedIngredients[0].ingred_id;
    console.log(this.selectedIngredients);
  }

  mounted() {
    service
      .getAllIngredient()
      .then(
        (ingredients) => (
          (this.ingredients = ingredients), (this.selectedIngredients = ingredients)
        )
      )
      .catch((error) => Alert.danger('Error getting ingredients: ' + error.message));

    service
      .getAllRepice()
      .then((recipes) => (this.recipes = recipes))
      .catch((error) => Alert.danger('Error getting recipes: ' + error.message));

    service
      .getAllRecipeContent()
      .then((recipeContent) => (this.recipeContent = recipeContent))
      .catch((error) => Alert.danger('Error getting recipe content: ' + error.message));

    //service that gets all ingredients in icebox
    service
      .getAllIceboxIngredients()
      .then((ingredients) => (this.choosenIngredient = ingredients))
      .then(() => this.filterRecipes())
      .catch((error) => Alert.danger('Error getting icebox ingredients: ' + error.message));
  }
}
