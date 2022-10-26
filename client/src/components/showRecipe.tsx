import * as React from 'react';
import { Component } from 'react-simplified';
import { Alert, Card, Row, Column, Form, Button, RecipeView } from '.././widgets';
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
  //liked: boolean = this.recipe.liked;

  render() {
    return (
      <div>
        <Card title="">
          <img src={this.recipe.bilde_adr} width="20px"></img>
          <h1>{this.recipe.oppskrift_navn}</h1>
          {this.recipe.oppskrift_beskrivelse != '' ? (
            <p>Beskrivelse: {this.recipe.oppskrift_beskrivelse}</p>
          ) : (
            ''
          )}
          <p>
            Kategori:{' '}
            {
              this.categories.find((kategori) => kategori.kategori_id == this.recipe.kategori_id)
                ?.kategori_navn
            }
          </p>
          <p>Antall likes: {this.recipe.ant_like}</p>
          <Form.Checkbox
            checked={this.recipe.liked}
            id="checkbox"
            onChange={() => {
              service.likeRecipe(this.recipe.oppskrift_id, !this.recipe.liked).then(() => {
                ShowRecipe.instance()?.mounted();
              });
            }}
          />
          <label htmlFor="checkbox" id="heart">
            test
          </label>
          <h5>Oppskrift:</h5>
          <pre>{this.recipe.oppskrift_steg}</pre>
          <h3>Ingredienser</h3>
          Porsjoner <Button.Danger onClick={this.decrementPortions}>-</Button.Danger>{' '}
          <b>{this.portions}</b> <Button.Success onClick={this.incrementPortions}>+</Button.Success>
          {this.recipeContent.map((rc, i) => (
            <p key={i}>
              {i + 1}.{' '}
              {this.ingredients.filter((ing) => rc.ingred_id == ing.ingred_id)[0].ingred_navn}{' '}
              {((rc.mengde * this.portions) / this.recipe.ant_pors).toFixed(1)} {rc.maleenhet}
            </p>
          ))}
        </Card>
        <Button.Success onClick={() => history.push('/recipe/edit/' + this.props.match.params.id)}>
          Endre oppskrift
        </Button.Success>
        <Button.Danger
          id="deleteRecipe"
          onClick={() => this.deleteRecipe(this.props.match.params.id)}
        >
          Slett oppskrift
        </Button.Danger>
        <Button.Success onClick={this.ingredientsToShoppingList}>
          Send ingredienser til handleliste
        </Button.Success>
      </div>
    );
  }

  mounted() {
    service
      .getAllIngredient()
      .then((ingredients) => (this.ingredients = ingredients))
      .catch((error) => Alert.danger('Error getting ingredients: ' + error.message));

    service
      .getRecipeContent(this.props.match.params.id)
      .then((recipeContent) => (this.recipeContent = recipeContent))
      .catch((error) => Alert.danger('Error getting recipe content: ' + error.message));

    service
      .getRecipe(this.props.match.params.id)
      .then((recipe) => {
        this.recipe = recipe[0];
        this.portions = recipe[0].ant_pors;
      })
      .catch((error) => Alert.danger('Error getting recipe: ' + error.message));

    service
      .getAllCategory()
      .then((categories) => (this.categories = categories))
      .catch((error) => Alert.danger('Error getting categories: ' + error.message));
  }
  incrementPortions() {
    this.portions++;
  }
  decrementPortions() {
    if (this.portions > 1) {
      this.portions--;
    }
  }
  deleteRecipe(id: number) {
    service
      .deleteRecipe(id)
      .then(() => history.push('/'))
      .catch((error) => Alert.danger('Error deleting recipe: ' + error.message));
  }
  ingredientsToShoppingList() {
    this.recipeContent.forEach((rc) => {
      const ingredient = {
        ingred_id: rc.ingred_id,
        mengde: (rc.mengde * this.portions) / this.recipe.ant_pors,
        maleenhet: rc.maleenhet,
      };
      service.addIngredient(ingredient);
    });
    history.push('/shoppinglist');
  }
  updateAntLikes() {
    if (this.recipe.liked == true) {
      this.recipe.ant_like++;
    } else {
      this.recipe.ant_like--;
    }
  }
}
