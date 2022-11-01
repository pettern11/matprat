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
  originalrecipes: Recipe[] = [];
  recipes: Recipe[] = [];
  //random number under here from 0 to recipes.length
  render() {
    let random: number = Math.floor(Math.random() * this.recipes.length);

    console.log(random);
    return (
      <>
        <Card title="">
          <div className="frontpage">
            <h1>Anbefalt oppskrift:</h1>
            <br></br>
            <div className={'recipeToDay'}>
              {this.recipes
                .filter((recipes, i) => i == random)
                .map((recipe) => (
                  <NavLink className="black" to={'/recipe/' + recipe.oppskrift_id}>
                    <p id="frontname">{recipe.oppskrift_navn}</p>
                    <img src={recipe.bilde_adr} className="frontPicture" alt="recipe" />
                  </NavLink>
                ))}
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
        this.originalrecipes = recipes;
        this.recipes = recipes;
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
