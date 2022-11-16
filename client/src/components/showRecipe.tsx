import * as React from 'react';
import { Component } from 'react-simplified';
import { Alert, Card, CardFull, Row, Column, Button, Cards, RecipeView } from '.././widgets';
import { NavLink } from 'react-router-dom';
import service, { Category, Ingredient, Recipe, Recipe_Content } from '.././service';
import { createHashHistory } from 'history';
const history = createHashHistory(); // Use history.push(...) to programmatically change path, for instance after successfully saving a student

export class ShowRecipe extends Component<{ match: { params: { id: number } } }> {
  recipe: Recipe = {
    oppskrift_id: 0,
    oppskrift_navn: '',
    oppskrift_beskrivelse: '',
    oppskrift_steg: '',
    ant_pors: 0,
    bilde_adr: '',
    kategori_id: 0,
    land_id: 0,
    ant_like: 0,
    liked: false,
  };
  portions: number = 0;
  recipeContent: Recipe_Content[] = [];
  ingredients: Ingredient[] = [];
  categories: Category[] = [];
  allRecipes: Recipe[] = [];
  recommendedRecipes: Recipe[] = [];

  render() {
    return (
      <div className="margintop">
        <Row>
          <div className="col-6" style={{ paddingRight: '0px' }}>
            <CardFull title="">
              <div className="download1">
                {/* @ts-ignore */}
                <center>
                  <img className="stort" src={this.recipe.bilde_adr}></img>
                  <br />
                  <br />
                  <h1>{this.recipe.oppskrift_navn}</h1>
                  <br />
                  {this.recipe.oppskrift_beskrivelse != '' ? (
                    <p>Beskrivelse: {this.recipe.oppskrift_beskrivelse}</p>
                  ) : (
                    ''
                  )}{' '}
                  <p className="font-weight-bold" style={{ marginBottom: '0px' }}>
                    Kategori:{' '}
                    {
                      this.categories.find(
                        (kategori) => kategori.kategori_id == this.recipe.kategori_id
                      )?.kategori_navn
                    }
                  </p>
                  {/* @ts-ignore */}
                </center>
              </div>
              {/* @ts-ignore */}
              <center>
                <input
                  type="checkbox"
                  id="checkbox"
                  checked={this.recipe.liked}
                  onChange={() => {
                    service.likeRecipe(this.recipe.oppskrift_id, !this.recipe.liked).then(() => {
                      ShowRecipe.instance()?.mounted();
                    });
                  }}
                />{' '}
                {/* Like knapp */}
                <label htmlFor="checkbox">
                  <svg id="heart-svg" viewBox="467 392 58 57" xmlns="http://www.w3.org/2000/svg">
                    <g id="Group" fill="none" fillRule="evenodd" transform="translate(467 392)">
                      <path
                        d="M29.144 20.773c-.063-.13-4.227-8.67-11.44-2.59C7.63 28.795 28.94 43.256 29.143 43.394c.204-.138 21.513-14.6 11.44-25.213-7.214-6.08-11.377 2.46-11.44 2.59z"
                        id="heart"
                        fill="#AAB8C2"
                      />
                      <circle
                        id="main-circ"
                        fill="#E2264D"
                        opacity="0"
                        cx="29.5"
                        cy="29.5"
                        r="1.5"
                      />

                      <g id="grp7" opacity="0" transform="translate(7 6)">
                        <circle id="oval1" fill="#9CD8C3" cx="2" cy="6" r="2" />
                        <circle id="oval2" fill="#8CE8C3" cx="5" cy="2" r="2" />
                      </g>

                      <g id="grp6" opacity="0" transform="translate(0 28)">
                        <circle id="oval1" fill="#CC8EF5" cx="2" cy="7" r="2" />
                        <circle id="oval2" fill="#91D2FA" cx="3" cy="2" r="2" />
                      </g>

                      <g id="grp3" opacity="0" transform="translate(52 28)">
                        <circle id="oval2" fill="#9CD8C3" cx="2" cy="7" r="2" />
                        <circle id="oval1" fill="#8CE8C3" cx="4" cy="2" r="2" />
                      </g>

                      <g id="grp2" opacity="0" transform="translate(44 6)">
                        <circle id="oval2" fill="#CC8EF5" cx="5" cy="6" r="2" />
                        <circle id="oval1" fill="#CC8EF5" cx="2" cy="2" r="2" />
                      </g>

                      <g id="grp5" opacity="0" transform="translate(14 50)">
                        <circle id="oval1" fill="#91D2FA" cx="6" cy="5" r="2" />
                        <circle id="oval2" fill="#91D2FA" cx="2" cy="2" r="2" />
                      </g>

                      <g id="grp4" opacity="0" transform="translate(35 50)">
                        <circle id="oval1" fill="#F48EA7" cx="6" cy="5" r="2" />
                        <circle id="oval2" fill="#F48EA7" cx="2" cy="2" r="2" />
                      </g>

                      <g id="grp1" opacity="0" transform="translate(24)">
                        <circle id="oval1" fill="#9FC7FA" cx="2.5" cy="3" r="2" />
                        <circle id="oval2" fill="#9FC7FA" cx="7.5" cy="2" r="2" />
                      </g>
                    </g>
                  </svg>
                </label>
              </center>
              <h4>Ingredienser:</h4>
              <br />
              {/* Viser ingrediensene */}
              <div className="scroll">
                {this.recipeContent.map((rc, i) => (
                  <Row key={i}>
                    <p style={{ width: '250px' }}>
                      {/* {i + 1}. find name of ingridient */}
                      {'• '}
                      {this.ingredients.find((ing) => ing.ingred_id == rc.ingred_id)?.ingred_navn}
                      {/* {this.ingredients.filter((ing) => rc.ingred_id == ing.ingred_id)[0].ingred_navn}{' '} */}
                    </p>
                    <p style={{ width: '75px' }}>
                      {((Number(rc.mengde) * this.portions) / this.recipe.ant_pors).toFixed(1)}
                    </p>
                    <p style={{ width: '260px' }}>{rc.maleenhet}</p>
                  </Row>
                ))}
              </div>
              <br />
              Porsjoner:{' '}
              <Button.Danger id="btnDec" onClick={this.decrementPortions}>
                -
              </Button.Danger>{' '}
              <b>{this.portions}</b>{' '}
              <Button.Success id="btnInc" onClick={this.incrementPortions}>
                +
              </Button.Success>
            </CardFull>
          </div>
          <div className="col-6" style={{ paddingRight: '0px', paddingLeft: '0px' }}>
            <CardFull title="">
              <div className="col">
                <Row>
                  <h4>Oppskrift:</h4>
                  <br />
                  <div className="download2">
                    <pre>{this.recipe.oppskrift_steg}</pre>
                  </div>
                </Row>
              </div>
            </CardFull>
          </div>
        </Row>
        <Button.Success onClick={() => history.push('/recipe/edit/' + this.props.match.params.id)}>
          Endre oppskrift
        </Button.Success>
        <Button.Danger
          //@ts-ignore
          id="deleteRecipe"
          onClick={() => this.deleteRecipe(this.props.match.params.id)}
        >
          Slett oppskrift
        </Button.Danger>
        <Button.Success id="btnSend" onClick={this.ingredientsToShoppingList}>
          Send ingredienser til handleliste
        </Button.Success>
        <Button.Success id="downloadPageBtn" onClick={this.downloadPage}>
          Last ned oppskriften
        </Button.Success>

        {/* Recomend 5 recipes based on the category */}
        <Card title="">
          <h3>Andre oppskrifter i samme kategori:</h3>
          <Row>
            {this.recommendedRecipes.length == 0 ? (
              <p>Ingen oppskrifter i samme kategori</p>
            ) : (
              this.recommendedRecipes.map((recipe, i) => (
                <Cards numbOfPors={recipe.ant_pors} title="" key={i}>
                  {/* Av en eller annen grunn så vil ikke siden mounte på nytt etter å ha bli sendt til recipe/recipe.oppskrift_id
                fikser dette ved å ha en onclick med this.mounted() */}
                  <NavLink
                    className="black"
                    onClick={() => {
                      this.mounted();
                    }}
                    to={'/recipe/' + recipe.oppskrift_id}
                  >
                    <RecipeView
                      img={recipe.bilde_adr}
                      name={recipe.oppskrift_navn}
                      numbOfPors={recipe.ant_pors}
                    ></RecipeView>
                  </NavLink>
                </Cards>
              ))
            )}
          </Row>
        </Card>
      </div>
    );
  }

  mounted() {
    //har alle apicallene som async funksjoner fordi forskjellige funksjoner trenger informasjon fra et eller flere apicall og hvis
    //disse ikke kommer i riktig rekkefølge blir react unhappy og vil ikke rendre riktig
    console.log('mounted');
    const apiCall1 = () => {
      /* Hent alle kategorier */

      return new Promise((resolve, reject) => {
        service
          .getAllCategory()
          .then((categories) => {
            (this.categories = categories), resolve(0);
          })
          .catch((error) => {
            Alert.danger('Error getting categories: ' + error.message), reject(1);
          });
      });
    };
    const apiCall2 = () => {
      return new Promise((resolve, reject) => {
        //henter oppskriften
        service
          .getRecipe(this.props.match.params.id)
          .then((recipe) => {
            this.recipe = recipe[0];
            this.portions = recipe[0].ant_pors;
            resolve(0);
          })
          .catch((error) => {
            Alert.danger('Error getting recipe: ' + error.message), reject(1);
          });
      });
    };

    const apiCall3 = () => {
      return new Promise((resolve, reject) => {
        /* Hent alle ingredienser */
        service
          .getAllIngredient()
          .then((ingredients) => {
            (this.ingredients = ingredients), resolve(0);
          })
          .catch((error) => {
            Alert.danger('Error getting ingredients: ' + error.message), reject(1);
          });
      });
    };
    const apiCall4 = () => {
      return new Promise((resolve, reject) => {
        /* Hent ingredienser til oppskrift */
        service
          .getRecipeContent(this.props.match.params.id)
          .then((recipeContent) => {
            (this.recipeContent = recipeContent), resolve(0);
          })
          .catch((error) => {
            Alert.danger('Error getting recipe content: ' + error.message), reject(1);
          });
      });
    };
    const apiCall5 = () => {
      return new Promise((resolve, reject) => {
        /* Hent alle oppskrifter */
        service
          .getAllRepice()
          .then((recipes) => {
            this.allRecipes = recipes;
            resolve(0);
          })
          .catch((error) => {
            Alert.danger('Error getting recipes: ' + error.message), reject(1);
          });
      });
    };
    const runApiCalls = async () => {
      await apiCall1();
      await apiCall2();
      await apiCall3();
      await apiCall4();
      await apiCall5();
      this.findRecommendedRecipes();
    };
    runApiCalls();
  }
  //Gjør siden nedlastbar, slik at den lett kan deles med andre. Kildekoden til dette er hentet fra stackoverflow
  //https://stackoverflow.com/questions/68152987/how-to-download-part-of-a-react-component

  downloadPage() {
    let element1 = document.querySelector('.download1') || document.createElement('div');
    let element2 = document.querySelector('.download2') || document.createElement('div');
    let element3 = document.querySelector('.scroll') || document.createElement('div');
    let pageHTML = element1.outerHTML;
    pageHTML += element2.outerHTML;
    pageHTML += element3.outerHTML;
    let css =
      '<style> pre { white-space: pre-wrap; font-size:16px}  p {display: inline-block} body {text-align:center}   </style>';
    const blob = new Blob([pageHTML, css], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const tempEl = document.createElement('a');
    document.body.appendChild(tempEl);
    tempEl.href = url;
    tempEl.download = this.recipe.oppskrift_navn + '.html';
    tempEl.click();
    Alert.info('Oppskriten ble lastet ned');
    setTimeout(() => {
      URL.revokeObjectURL(url);
      /* @ts-ignore */
      tempEl.parentNode.removeChild(tempEl);
    }, 2000);
  }
  //Finner 5 tilfeldige oppskrifter i samme kategori som den valgte oppskriften
  findRecommendedRecipes() {
    this.recommendedRecipes = this.allRecipes.filter(
      (recipe) =>
        recipe.kategori_id == this.recipe.kategori_id &&
        recipe.oppskrift_id != this.recipe.oppskrift_id
    );
    //chose 5 random recipes
    this.recommendedRecipes = this.recommendedRecipes.sort(() => Math.random() - 0.5).slice(0, 5);
  }

  //Gir mulighet til å øke antall porsjoner
  incrementPortions() {
    this.portions++;
  }

  //Gir mulighet til å minke antall porsjoner
  decrementPortions() {
    if (this.portions > 1) {
      this.portions--;
    }
  }

  //Slette oppskrift
  deleteRecipe(id: number) {
    service
      .deleteRecipe(id)
      .then(() => history.push('/'))
      .catch((error) => Alert.danger('Error deleting recipe: ' + error.message));
  }

  //Legger til ingredienser til handleliste
  ingredientsToShoppingList() {
    let i = 0;
    this.recipeContent.forEach((rc) => {
      const ingredient = {
        ingred_id: rc.ingred_id,
        mengde: (Number(rc.mengde) * this.portions) / this.recipe.ant_pors,
        maleenhet: rc.maleenhet,
      };
      service.addIngredient(ingredient).then(() => {
        history.push('/shoppinglist');
      });
    });
  }
}
