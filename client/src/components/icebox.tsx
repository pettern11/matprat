import * as React from 'react';
import { Component } from 'react-simplified';
import {
  Alert,
  Card,
  Row,
  Column,
  Form,
  Button,
  RecipeView,
  Cards,
  IceboxsCard,
} from '.././widgets';
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
  recipes: Recipe[] = [];
  iceboxIngredients: IceboxIngredient[] = [];
  selectedIngredients: Ingredient[] = [];
  searchterm: string = '';
  originalrecipes: Recipe[] = [];
  recipeContent: Recipe_Content[] = [];
  uniqueRecipeId = [];
  unique = [];

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

  recipeContens: Recipe_Content = {
    oppskrift_id: 0,
    ingred_id: 0,
    mengde: 0,
    maleenhet: '',
  };

  render() {
    return (
      <>
        <Column width={1}>
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

                  this.addIngredientToIcebox();
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
              {this.iceboxIngredients.map((ingredient, idx) => (
                <Row key={idx}>
                  <Column width={3}>{ingredient.ingred_navn}</Column>
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
        </Column>
        <Card title="Oppskrifter basert på dine ingredienser">
          <div id="icebox">
            <Row>
              <>
                {console.log(this.uniqueRecipeId)}
                {this.recipes
                  .filter((recipe) => this.uniqueRecipeId.some((e) => e == recipe.oppskrift_id))

                  /*              .filter((recipe) => {
                this.recipeContent.map(
                  (rc) =>
                    this.ingredients.filter((ing) => rc.ingred_id == ing.ingred_id)[0].ingred_navn
                );
              })*/
                  .map((recipe, idx) => (
                    <IceboxsCard title="" key={idx}>
                      <NavLink className="black" to={'/recipe/' + recipe.oppskrift_id}>
                        <RecipeView
                          img={recipe.bilde_adr}
                          name={recipe.oppskrift_navn}
                          numbOfPors={recipe.ant_pors}
                        ></RecipeView>
                      </NavLink>
                    </IceboxsCard>
                  ))}
              </>
            </Row>
          </div>
        </Card>
      </>
    );
  }
  /*
    Kolonne 2 - oppskrifter basert på dine ingredienser

    Icebox --> ingrediens --> oppskrift_innhold --> oppskrift
  
  */

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
      .catch((error) => Alert.danger('Error getting icebox ingredients: ' + error.message));

    service
      .getAllRepice()
      .then((recipes) => {
        this.originalrecipes = recipes;
        this.recipes = recipes;
      })
      .catch((error) => Alert.danger('Error getting tasks: ' + error.message));

    this.iceboxIngredients;
    service
      .getAllRecipeContent()
      .then((recipeContent: Recipe_Content[]) => (this.recipeContent = recipeContent))
      .then(() => {
        this.unique = this.recipeContent
          .filter((rc) => this.iceboxIngredients.some((ii) => rc.ingred_id == ii.ingred_id))

          .filter((element) => {
            const isDuplicate = this.uniqueRecipeId.includes(element.oppskrift_id);

            if (!isDuplicate) {
              this.uniqueRecipeId.push(element.oppskrift_id);

              return true;
            }
            return false;
          });

        //console.log(this.uniqueRecipeId);
      })
      .catch((error: { message: string }) =>
        Alert.danger('Error getting recipe content: ' + error.message)
      );
  }
  search(searchterm: string) {
    this.selectedIngredients = this.ingredients.filter((ingredient) =>
      ingredient.ingred_navn.toLowerCase().includes(searchterm.toLowerCase())
    );
    this.selectedIngredient.ingred_id = this.selectedIngredients[0].ingred_id;
    console.log(this.selectedIngredients);
  }
  addIngredientToIcebox() {
    service
      .addIngredientToIcebox(this.selectedIceboxIngredient)
      .then(() => this.mounted())
      .catch((error) => Alert.danger('Error, ingredient already added: ' + error.message));
  }
  deleteIceboxIngredient(ingred_id: number) {
    service
      .deleteIceboxIngredient(ingred_id)
      .then(() => this.mounted())
      .catch((error) => Alert.danger('Error deleting icebox ingredient: ' + error.message));
  }
}
