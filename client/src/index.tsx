import ReactDOM from 'react-dom';
import * as React from 'react';
import { Component } from 'react-simplified';
import { NavLink, HashRouter, Route } from 'react-router-dom';
import { NavBar, Card, Alert, Column, Row, Form, Button, RecipeView } from './widgets';
import { NewRecipe } from './components';

import service, { Recipe } from './service';
import { createHashHistory } from 'history';

class Menu extends Component {
  render() {
    return (
      <NavBar brand="MatForum">
        <NavBar.Link to="/newrecipe">Ny oppskrift</NavBar.Link>
      </NavBar>
    );
  }
}

class Home extends Component {
  recipes: Recipe[] = [];

  render() {
    return (
      <>
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
      .then((recipes) => (this.recipes = recipes))
      .catch((error) => Alert.danger('Error getting tasks: ' + error.message));
  }
}

ReactDOM.render(
  <HashRouter>
    <div>
      <Alert />
      <Menu />
      <Route exact path="/" component={Home} />
      <Route exact path="/newrecipe" component={NewRecipe} />
    </div>
  </HashRouter>,
  document.getElementById('root')
);
