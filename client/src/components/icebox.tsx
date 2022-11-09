import * as React from 'react';
import { Component } from 'react-simplified';
import {
  Alert,
  Card,
  Row,
  Rows,
  Column,
  Form,
  Button,
  RecipeView,
  Cards,
  IceboxsCard,
} from '.././widgets';
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
  selectedIngredient: Ingredient = { ingred_id: 0, ingred_navn: ' ' };
  render() {
    return (
      <>
        <div className="margintop">
          <Column width={2}>
            <Card title="Dine ingredienser:">
              <Column>
                Søk:
                <Form.Input
                  id="iceboxlistsearch"
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
                    this.selectedIngredient.ingred_navn =
                      event.currentTarget.selectedOptions[0].text;
                  }}
                >
                  {this.selectedIngredients.map((ingredient, idx) => (
                    <option key={idx} value={ingredient.ingred_id}>
                      {ingredient.ingred_navn}
                    </option>
                  ))}
                </select>
                <Button.Success
                  id="btnIngredAdd"
                  onClick={() => {
                    this.chooseIngredientFunc();
                  }}
                >
                  Legg til ingrediens
                </Button.Success>
              </Column>
              <Column>
                <br />
                {this.choosenIngredient.map((ingredient, idx) => (
                  <Row key={idx}>
                    <p style={{ width: '190px' }}>{ingredient.ingred_navn}</p>
                    <Column width={2}>
                      <Button.Danger
                        onClick={() => {
                          this.deleteIceboxIngredient(ingredient.ingred_id);
                        }}
                      >
                        X
                      </Button.Danger>
                    </Column>
                  </Row>
                ))}
              </Column>
            </Card>
          </Column>
          <Card title="Oppskrifter basert på dine ingredienser:">
            <div id="icebox">
              <Rows>
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
              </Rows>
            </div>
          </Card>
        </div>
      </>
    );
  }
  chooseIngredientFunc() {
    let id = document.getElementById('selectExistingIngredient')?.value;
    //find name of ingredient with id
    let name = this.selectedIngredients.find((ingredient) => ingredient.ingred_id == Number(id));

    let add = { ingred_id: id, ingred_navn: name?.ingred_navn || '' };
    console.log(add);
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
      .then(() => {
        return;
      })
      .catch((error) => Alert.danger('Error deleting icebox ingredient: ' + error.message));
  }

  filterRecipes() {
    //filter the recipes based on the ingredients in the icebox
    //if the recipe contains one of the ingreient it will be added, if the recipe allready exists it will not be added
    this.filteredRecipes = [];
    this.recipes.forEach((recipe) => {
      this.recipeContent.forEach((content) => {
        if (recipe.oppskrift_id == content.oppskrift_id) {
          this.choosenIngredient.forEach((ingredient) => {
            if (content.ingred_id == ingredient.ingred_id) {
              if (!this.filteredRecipes.includes(recipe)) {
                this.filteredRecipes.push(recipe);
              }
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
    this.selectedIngredient.ingred_id = this.selectedIngredients[0]?.ingred_id || 0;
    return;
  }

  mounted() {
    service
      .getAllIngredient()
      .then(
        (ingredients) => (
          (this.ingredients = ingredients.sort((a, b) =>
            a.ingred_navn.localeCompare(b.ingred_navn)
          )),
          (this.selectedIngredients = ingredients.sort((a, b) =>
            a.ingred_navn.localeCompare(b.ingred_navn)
          ))
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
      .then((recipeContent) => {
        (this.recipeContent = recipeContent),
          setTimeout(() => {
            this.filterRecipes();
          });
      })
      .catch((error) => Alert.danger('Error getting recipe content: ' + error.message));

    //service that gets all ingredients in icebox
    service
      .getAllIceboxIngredients()
      .then((ingredients) => {
        (this.choosenIngredient = ingredients),
          //waits for all ingredients to be added to choosenIngredient before filtering recipes
          this.choosenIngredient.length == ingredients.length ? this.filterRecipes() : '';
      })
      // .then(() => this.filterRecipes())
      .catch((error) => Alert.danger('Error getting icebox ingredients: ' + error.message));
  }
}
