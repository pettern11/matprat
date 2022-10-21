import ReactDOM from 'react-dom';
import * as React from 'react';
import { Component } from 'react-simplified';
import { NavLink, HashRouter, Route } from 'react-router-dom';
import { NavBar, Card, Alert, Column, Row, Form, Button, RecipeView } from './widgets';
import { NewRecipe, ShowRecipe, EditRecipe, ShoppingList } from './components';

import service, { Recipe } from './service';
import { createHashHistory } from 'history';

export class Menu extends Component {
  render() {
    return (
      <>
        <NavBar brand="MatForum">
          <NavBar.Link to="/newrecipe">Ny oppskrift</NavBar.Link>
          <NavBar.Link to="/shoppinglist">Handleliste</NavBar.Link>
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
        <p>Hei</p>
        <Card title="Søkefelt">
          <Form.Input
            id="indexsearch"
            type="text"
            value={this.searchterm}
            onChange={(event) => {
              this.search(event.currentTarget.value);
              this.searchterm = event.currentTarget.value;
            }}
          />
        </Card>
        <Card title="Oppskrifter">
          {this.recipes.map((recipe) => (
            <Row key={recipe.oppskrift_id}>
              <Column>
                <NavLink
                  style={{ textDecoration: 'none', color: 'black' }}
                  to={'/recipe/' + recipe.oppskrift_id}
                >
                  <RecipeView
                    img={recipe.bilde_adr}
                    name={recipe.oppskrift_navn}
                    numbOfPors={recipe.ant_pors}
                  ></RecipeView>
                </NavLink>
              </Column>
            </Row>
          ))}
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

    service.getAPI().then((api) => {
      console.log(api);
      this.api = api;
    });
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
    </div>
  </HashRouter>,
  document.getElementById('root') || document.createElement('div')
);
