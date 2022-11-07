import * as React from 'react';
import { Component } from 'react-simplified';
import { Alert, Cards, Oppskrifter, Row, Rows, RecipeView } from '.././widgets';
import { NavLink } from 'react-router-dom';
import service, { Recipe, List } from '.././service';
import { createHashHistory } from 'history';

const history = createHashHistory(); // Use history.push(...) to programmatically change path, for instance after successfully saving a student
export class LikedRecipes extends Component {
  originalrecipes: Recipe[] = [];
  recipes: Recipe[] = [];

  render() {
    return (
      <div className="margintop">
        <div className="container-fluid">
          <Rows>
            {this.recipes
              .filter((recipe) => recipe.liked == true)
              .map((likedRecipe) => (
                <Cards title="" key={likedRecipe.oppskrift_id}>
                  <NavLink className="black" to={'/recipe/' + likedRecipe.oppskrift_id}>
                    <RecipeView
                      img={likedRecipe.bilde_adr}
                      name={likedRecipe.oppskrift_navn}
                      numbOfPors={likedRecipe.ant_pors}
                    ></RecipeView>
                  </NavLink>
                </Cards>
              ))}
          </Rows>
        </div>
      </div>
    );
  }

  mounted() {
    service
      .getAllRepice()
      .then((recipes) => {
        this.originalrecipes = recipes;
        this.recipes = recipes;
      })
      .catch((error) => Alert.danger('Error getting tasks: ' + error.message));
  }
}
