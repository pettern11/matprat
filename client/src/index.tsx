import ReactDOM from 'react-dom';
import * as React from 'react';
import { Component } from 'react-simplified';
import { NavLink, HashRouter, Route } from 'react-router-dom';
import { NavBar, Car, Card, Cardse, Alert, Row, Rows, RecipeView } from './widgets';
import { NewRecipe } from './components/newRecipe';
import { EditRecipe } from './components/editRecipe';
import { ShowRecipe } from './components/showRecipe';
import { LikedRecipes } from './components/liked';
import { ShoppingList } from './components/shoppingList';
import { Icebox } from './components/icebox';
import { ShowAllRecipe } from './components/showAllRecipe';

import service, { Recipe } from './service';

export class Menu extends Component {
  render() {
    return (
      <>
        <div className="header">
          <NavBar brand="Hjem">
            <NavBar.Link to="/showallrecipe">Alle oppskrifter</NavBar.Link>
            <NavBar.Link to="/newrecipe">Ny oppskrift</NavBar.Link>
            <NavBar.Link to="/liked">Likte</NavBar.Link>
            <NavBar.Link to="/shoppinglist">Handleliste</NavBar.Link>
            <NavBar.Link to="/icebox">Kjøleskap</NavBar.Link>
          </NavBar>
        </div>
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
        <div className="margintop">
          <Card title="">
            <div className="frontpage">
              <h1>Prøv oppskriften:</h1>
              <br></br>
              {/* @ts-ignore */}
              {/* <div className="text-center"> */}
              {/* @ts-ignore */}
              <center>
                <Rows>
                  <Car title="">
                    <div className={'recipeToDay'}>
                      {this.recipes.length != 0
                        ? this.recipes
                            .filter((recipes, i) => i == random)
                            .map((recipe, rei) => (
                              <div key={rei}>
                                <NavLink
                                  key={rei + 'navlink'}
                                  className="black"
                                  to={'/recipe/' + recipe.oppskrift_id}
                                >
                                  <img
                                    key={rei + 'picture'}
                                    src={recipe.bilde_adr}
                                    className="frontPicture"
                                    alt="recipe"
                                  />
                                  <br />
                                  <br />
                                  <h3 key={rei + 'name'} id="frontname" style={{ color: 'black' }}>
                                    {recipe.oppskrift_navn}
                                  </h3>
                                </NavLink>
                              </div>
                            ))
                        : ''}
                    </div>
                  </Car>
                </Rows>
                {/* @ts-ignore */}
              </center>
              {/* </div> */}
              <br />
              <br />
              <div>
                <div title="Anbefalte oppskrifter basert på dine likte:">
                  <h5>Anbefalte oppskrifter basert på det du liker:</h5>
                  <br />
                  <Rows>
                    {this.recipes.length != 0
                      ? this.suggestedRecipeList.map((likedRecipe, i) => (
                          <Cardse
                            numbOfPors={0}
                            title=""
                            key={likedRecipe.oppskrift_id + i + 'card'}
                          >
                            <NavLink
                              key={likedRecipe.oppskrift_id + 'navlink2'}
                              className="black"
                              to={'/recipe/' + likedRecipe.oppskrift_id}
                            >
                              <RecipeView
                                key={likedRecipe.oppskrift_id + 'recipeview'}
                                img={likedRecipe.bilde_adr}
                                name={likedRecipe.oppskrift_navn}
                                numbOfPors={likedRecipe.ant_pors}
                              ></RecipeView>
                            </NavLink>
                          </Cardse>
                        ))
                      : ''}
                  </Rows>
                  <br />
                  {/* @ts-ignore */}
                  <NavBar.Links to={'/showallrecipe'} style={{ width: '130px' }}>
                    Alle oppskrifter
                  </NavBar.Links>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </>
    );
  }
  mounted() {
    //henter alle oppskrifter
    service
      .getAllRepice()
      .then((recipes) => {
        this.recipes = recipes;
        //Hvis man ikke har likt noen oppskrifter så vises 5 tilfeldige oppskrifter
        if (this.recipes.filter((recipe) => recipe.liked == true).length <= 0) {
          //loop five times to get five random recipes
          for (let i = 0; i < 5; i++) {
            this.suggestedRecipeList.push(
              this.recipes[Math.floor(Math.random() * this.recipes.length)]
            );
          }
        } else {
          //Først finner man alle land og kategorier som er likt basert på oppskrifter som er likt
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

          //Filtrerer og velger de som har likt land og kategori og ikke er likt, disse pushes til en egen array
          this.recipes.map((element) => {
            //@ts-ignore
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

          //Finner de 5 tilfeldige oppskriftene som skal vises
          for (let i = 0; i < 5; i++) {
            //random number from suggestedRecipe
            let random = Math.floor(Math.random() * this.suggestedRecipe.length);
            this.suggestedRecipeList.push(this.suggestedRecipe[random]);

            this.suggestedRecipe.splice(random, 1);
          }
        }
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
      <Route exact path="/icebox" component={Icebox}></Route>
    </div>
  </HashRouter>,
  document.getElementById('root') || document.createElement('div')
);
