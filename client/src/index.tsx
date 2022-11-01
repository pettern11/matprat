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
import { Icebox } from './components/icebox';

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
          <NavBar.Link to="/icebox">Kjøleskap</NavBar.Link>
        </NavBar>
      </>
    );
  }
}

export class Home extends Component {
  originalrecipes: Recipe[] = [];
  recipes: Recipe[] = [];
  searchterm: string = '';
  api: [] = [];
  render() {
    return (
      <>
        <Car title="Søkefelt">
          <Form.Input
            id="indexsearch"
            type="text"
            value={this.searchterm}
            onChange={(event) => {
              this.search(event.currentTarget.value);
              this.searchterm = event.currentTarget.value;
            }}
          />
        </Car>
        <div className="container">
          <Row>
            <Oppskrifter title="Oppskrifter">
              <select onChange={(event) => this.sort(event.target.value)}>
                <option>Sorter</option>
                <option value="0">A-Z</option>
                <option value="1">Z-A</option>
                <option value="2">Nyeste</option>
              </select>
              <br></br>

              <div className="container">
                <Row>
                  {this.recipes.map((recipe) => (
                    <Cards title="" key={recipe.oppskrift_id}>
                      <NavLink className="black" to={'/recipe/' + recipe.oppskrift_id}>
                        <RecipeView
                          img={recipe.bilde_adr}
                          name={recipe.oppskrift_navn}
                          numbOfPors={recipe.ant_pors}
                        ></RecipeView>
                      </NavLink>
                    </Cards>
                  ))}
                </Row>
              </div>
            </Oppskrifter>

            <Mat title="Kanskje du liker">
              <Cards title="Mat"></Cards>
            </Mat>
          </Row>
        </div>
      </>
    );
  }
  sort(value: number) {
    if (value == 0) {
      this.recipes.sort(function (a, b) {
        const x = a.oppskrift_navn.toLowerCase();
        const y = b.oppskrift_navn.toLowerCase();
        return x < y ? -1 : x > y ? 1 : 0;
      });
    } else if (value == 1) {
      this.recipes.sort(function (b, a) {
        const x = a.oppskrift_navn.toLowerCase();
        const y = b.oppskrift_navn.toLowerCase();
        return x < y ? -1 : x > y ? 1 : 0;
      });
    } else {
      this.recipes.sort(function (b, a) {
        const x = a.oppskrift_id;
        const y = b.oppskrift_id;
        return x < y ? -1 : x > y ? 1 : 0;
      });
    }
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
  search(searchterm: string) {
    this.recipes = this.originalrecipes.filter((recipe) =>
      recipe.oppskrift_navn.toLowerCase().includes(searchterm.toLowerCase())
    );
  }
}

ReactDOM.render(
  <HashRouter>
    <div>
      <Alert />
      <Menu />
      <Route exact path="/" component={Home} />
      <Route exact path="/newrecipe" component={NewRecipe} />
      <Route exact path="/recipe/:id" component={ShowRecipe} />
      <Route exact path="/recipe/edit/:id" component={EditRecipe} />
      <Route exact path="/shoppinglist" component={ShoppingList} />
      <Route exact path="/liked" component={LikedRecipes}></Route>
      <Route exact path="/icebox" component={Icebox}></Route>
    </div>
  </HashRouter>,
  document.getElementById('root') || document.createElement('div')
);
