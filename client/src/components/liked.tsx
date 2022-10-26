import * as React from 'react';
import { Component } from 'react-simplified';
import {
  Alert,
  Card,
  Cards,
  Oppskrifter,
  Row,
  Column,
  Form,
  Button,
  RecipeView,
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
} from '.././service';
import { createHashHistory } from 'history';

const history = createHashHistory(); // Use history.push(...) to programmatically change path, for instance after successfully saving a student
export class LikedRecipes extends Component {
  likedList: List[] = [];
  originalrecipes: Recipe[] = [];
  recipes: Recipe[] = [];

  render() {
    return (
      <Oppskrifter title="Likede oppskrifter">
        <div className="container">
          <Row>
            
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
           
          </Row>
        </div>
      </Oppskrifter>
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
