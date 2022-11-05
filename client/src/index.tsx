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
import { ShowAllRecipe } from './components/showAllRecipe';

import service, { Recipe } from './service';
import { createHashHistory } from 'history';

export class Menu extends Component {
  render() {
    return (
      <>
        <div className="header">
          <NavBar brand="Hjem">
            <NavBar.Link to="/showallrecipe">Alle oppskrifter</NavBar.Link>
            <NavBar.Link to="/newrecipe">Ny oppskrift</NavBar.Link>
            <NavBar.Link to="/liked">Liked</NavBar.Link>
            <NavBar.Link to="/shoppinglist">Handleliste</NavBar.Link>
            <NavBar.Link to="/icebox">Kjøleskap</NavBar.Link>
          </NavBar>
        </div>
      </>
    );
  }
}
export class Home extends Component {
  isMounted = false;
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
        {this.isMounted ? (
          <Card title="">
            <div className="frontpage">
              <h1>Anbefalt oppskrift:</h1>
              <br></br>
              <div className={'recipeToDay'}>
                {this.recipes.length != 0
                  ? this.recipes
                      .filter((recipes, i) => i == random)
                      .map((recipe, rei) => (
                        <div key={rei}>
                          <NavLink className="black" to={'/recipe/' + recipe.oppskrift_id}>
                            <img src={recipe.bilde_adr} className="frontPicture" alt="recipe" />
                            <br />
                            <br />
                            <h3 id="frontname" style={{ color: 'black' }}>
                              {recipe.oppskrift_navn}
                            </h3>
                          </NavLink>
                        </div>
                      ))
                  : ''}
              </div>
              <br />
              <br />
              <div>
                <div title="Anbefalte oppskrifter basert på dine likte:">
                  Anbefalte oppskrifter basert på det du liker
                  <center>
                    <Row>
                      {this.recipes.length != 0
                        ? this.suggestedRecipeList.map((likedRecipe) => (
                            <Cards>
                              <NavLink className="black" to={'/recipe/' + likedRecipe.oppskrift_id}>
                                <RecipeView
                                  img={likedRecipe.bilde_adr}
                                  name={likedRecipe.oppskrift_navn}
                                  numbOfPors={likedRecipe.ant_pors}
                                ></RecipeView>
                              </NavLink>
                            </Cards>
                          ))
                        : ''}
                    </Row>
                  </center>
                  <NavBar.Link to={'/showallrecipe'} style={{ width: '130px' }}>
                    Alle oppskrifter
                  </NavBar.Link>
                </div>
              </div>
            </div>
          </Card>
        ) : (
          ''
        )}
      </>
    );
  }
  mounted() {
    this.isMounted = false;
    service
      .getAllRepice()
      .then((recipes) => {
        this.recipes = recipes;
        if (this.recipes.filter((recipe) => recipe.liked == true).length <= 0) {
          //loop five times to get five random recipes
          for (let i = 0; i < 5; i++) {
            this.suggestedRecipeList.push(
              this.recipes[Math.floor(Math.random() * this.recipes.length)]
            );
          }
        } else {
          this.recipes
            .filter((recipe) => recipe.liked == true)
            .map(
              (likedRecipe) => (
                //@ts-ignore
                this.likedFromCountrey.push(likedRecipe.land_id),
                //@ts-ignore
                this.likedFromCategory.push(likedRecipe.kategori_id)
              )
            );
          console.log(this.likedFromCountrey, this.likedFromCategory);

          this.recipes.map((element) => {
            //@ts-ignore
            console.log(this.likedFromCountrey.includes(element.land_id));
            if (
              //@ts-ignore
              this.likedFromCountrey.includes(element.land_id) &&
              //@ts-ignore
              this.likedFromCategory.includes(element.kategori_id) &&
              element.liked == false
            ) {
              this.suggestedRecipe.push(element);
            }
          });

          for (let i = 0; i < this.recipes.length; i++) {
            //@ts-ignore
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
        }
      })
      .catch((error) => Alert.danger('Error getting tasks: ' + error.message));
    this.isMounted = true;
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
      <Route exact path="/icebox" component={Icebox}></Route>
    </div>
  </HashRouter>,
  document.getElementById('root') || document.createElement('div')
);
