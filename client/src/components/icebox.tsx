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
import Select from 'react-select';

export class Icebox extends Component {
  ingredients: [{ value: number; label: string }] = [{ value: 0, label: 'Søk på ingredienser' }];
  selectedIngredients: Ingredient[] = [];
  recipes: Recipe[] = [];
  filteredRecipes: Recipe[] = [];
  recipeContent: Recipe_Content[] = [];
  choosenIngredient: Ingredient[] = [];

  render() {
    return (
      <>
        <div className="margintop">
          <Column width={2}>
            <Card title="Dine ingredienser:">
              &nbsp;Søk:¨
              <Select
                id="choseIngredient"
                options={this.ingredients}
                //width="200px" fungerer ikke står i dokumentasjonen at dette er måten å gjøre det på
                //men det fungerer ikke https://react-select.com/styles
                onChange={(event) => {
                  this.chooseIngredientFunc(event);
                }}
              />
              <Column>
                <br />
                {this.choosenIngredient.map((ingredient, idx) => (
                  <Row key={idx}>
                    <p style={{ width: '199px' }}>{ingredient.ingred_navn}</p>
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
                      {/* her må jeg bruke a tag med href link for at testing skal gå gjennom
                      får feilmedlingen  console.error "The above error occurred in the <Router.Consumer> component"
                      når jeg bruker navlink men testen går gjennom med a href og har ikke noe å si på funksjonaliteten til siden */}
                      <a className="black" href={'#/recipe/' + recipe.oppskrift_id}>
                        {/* <NavLink to={'/recipe/' + recipe.oppskrift_id}> */}
                        <RecipeView
                          img={recipe.bilde_adr}
                          name={recipe.oppskrift_navn}
                          numbOfPors={recipe.ant_pors}
                        ></RecipeView>
                        {/* </NavLink> */}
                      </a>
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
  chooseIngredientFunc(event: { value: number; label: string }) {
    let add = {
      ingred_id: event.value,
      ingred_navn: event.label,
    };
    console.log(add);
    service
      .addIngredientToIcebox(add)
      .then(() => {
        this.choosenIngredient.push(add);
        setTimeout(() => {
          this.filterRecipes();
        });
      })
      .catch((error) => {
        console.log(error), Alert.danger('Error, ingredient already added: ' + error.message);
      });
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
    console.log(this.recipes, this.recipeContent, this.choosenIngredient);
    this.recipes.forEach((recipe) => {
      this.recipeContent.forEach((recipeContent) => {
        if (recipe.oppskrift_id == recipeContent.oppskrift_id) {
          this.choosenIngredient.forEach((ingredient) => {
            if (recipeContent.ingred_id == ingredient.ingred_id) {
              if (!this.filteredRecipes.includes(recipe)) {
                this.filteredRecipes.push(recipe);
              }
            }
          });
        }
      });
    });
  }

  mounted() {
    service
      .getAllIngredient()
      .then((ingredients) => {
        ingredients.forEach((element) => {
          this.ingredients.push({ value: element.ingred_id, label: element.ingred_navn });
        });
      })
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
      .catch((error) => Alert.danger('Error getting icebox ingredients: ' + error.message));
  }
}
