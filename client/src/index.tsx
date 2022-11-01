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
  render() {
    return <>halla </>;
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
