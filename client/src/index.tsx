import ReactDOM from 'react-dom';
import * as React from 'react';
import { Component } from 'react-simplified';
import { NavLink, HashRouter, Route } from 'react-router-dom';
import {
  NavBar,
  Car,
  Card,
  Cards,
  Alert,
  Column,
  Row,
  Form,
  Button,
  RecipeView,
  Oppskrifter,
  Mat,
} from './widgets';
import { NewRecipe } from './components/newRecipe';
import { EditRecipe } from './components/editRecipe';
import { ShowRecipe } from './components/showRecipe';
import { LikedRecipes } from './components/liked';
import { ShoppingList } from './components/shoppingList';
import { ShowAllRecipe } from './components/showAllRecipe';

import service, { Recipe } from './service';
import { createHashHistory } from 'history';

export class Menu extends Component {
  render() {
    return (
      <>
        <NavBar brand="MatForum">
          <NavBar.Link to="/newrecipe">Ny oppskrift</NavBar.Link>
          <NavBar.Link to="/shoppinglist">Handleliste</NavBar.Link>
          <NavBar.Link to="/liked">Liked</NavBar.Link>
          <NavBar.Link to="/showallrecipe">Alle oppskrifter</NavBar.Link>
        </NavBar>
      </>
    );
  }
}
export class Home extends Component {
  suggestedRecipe: Recipe[] = [];
  recipes: Recipe[] = [];
  suggestedRecipeList: Recipe[] = [];

  likedFromCountrey: [] = [];
  likedFromCategory: [] = [];

  //random number under here from 0 to recipes.length
  render() {
    //finds the recipes that are liked and adds the country and category id to the arrays
    let random: number = Math.floor(Math.random() * this.recipes.length);

    return (
      <>
        <Card title="">
          <div className="frontpage">
            <h1>Anbefalt oppskrift:</h1>
            <br></br>
            <div className={'recipeToDay'}>
              {this.recipes
                .filter((recipes, i) => i == random)
                .map((recipe, rei) => (
                  <div key={rei}>
                    <NavLink className="black" to={'/recipe/' + recipe.oppskrift_id}>
                      <p id="frontname">{recipe.oppskrift_navn}</p>
                      <img src={recipe.bilde_adr} className="frontPicture" alt="recipe" />
                    </NavLink>
                  </div>
                ))}
            </div>

            <div>
              <Card title="Anbefalte oppskrifter basert på dine likte:">
                <center>
                  <table>
                    <tr>
                      {this.suggestedRecipeList.map((likedRecipe) => (
                        <td>
                          <NavLink className="black" to={'/recipe/' + likedRecipe.oppskrift_id}>
                            <RecipeView
                              img={likedRecipe.bilde_adr}
                              name={likedRecipe.oppskrift_navn}
                              numbOfPors={likedRecipe.ant_pors}
                            ></RecipeView>
                          </NavLink>
                        </td>
                      ))}
                    </tr>
                  </table>
                </center>
                <NavLink className="black" to={'/showallrecipe'}>
                  Knapp til allllle oppskriftene
                </NavLink>
              </Card>
            </div>
          </div>
        </Card>
      </>
    );
  }
  mounted() {
    service
      .getAllRepice()
      .then((recipes) => {
        this.recipes = recipes;

        this.recipes
          .filter((recipe) => recipe.liked == true)
          .map(
            (likedRecipe) => (
              this.likedFromCountrey.push(likedRecipe.land_id),
              this.likedFromCategory.push(likedRecipe.kategori_id)
            )
          );
        console.log(this.likedFromCountrey, this.likedFromCategory);

        this.recipes.map((element) => {
          console.log(this.likedFromCountrey.includes(element.land_id));
          if (
            this.likedFromCountrey.includes(element.land_id) &&
            this.likedFromCategory.includes(element.kategori_id) &&
            element.liked == false
          ) {
            this.suggestedRecipe.push(element);
          }
        });

        for (let i = 0; i < this.recipes.length; i++) {
          if (this.likedFromCategory.includes(this.recipes[i].kategori_id)) {
            this.suggestedRecipe.push(this.recipes[i]);
          } else {
          }
        }

        for (let i = 0; i < 5; i++) {
          //random number from suggestedRecipe
          let random = Math.floor(Math.random() * this.suggestedRecipe.length);
          this.suggestedRecipeList.push(this.suggestedRecipe[random]);

          this.suggestedRecipe.splice(random, 1);
        }
        console.log(this.suggestedRecipeList);
      })
      .catch((error) => Alert.danger('Error getting tasks: ' + error.message));
  }
}

ReactDOM.render(
  <HashRouter>
    <div>
      <Alert />
      <Menu />
      <Route exact path="/" component={Home} />
      <Route exact path="/showallrecipe" component={ShowAllRecipe} />
      <Route exact path="/newrecipe" component={NewRecipe} />
      <Route exact path="/recipe/:id" component={ShowRecipe} />
      <Route exact path="/recipe/edit/:id" component={EditRecipe} />
      <Route exact path="/shoppinglist" component={ShoppingList} />
      <Route exact path="/liked" component={LikedRecipes}></Route>
    </div>
  </HashRouter>,
  document.getElementById('root') || document.createElement('div')
);
