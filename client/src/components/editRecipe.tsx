import * as React from 'react';
import { Component } from 'react-simplified';
import { Alert, Card, Row, Column, Form, Button, RecipeView } from '.././widgets';
import { NavLink, Redirect } from 'react-router-dom';
import service, { Ingredient, Recipe, Recipe_Content } from '.././service';
import { createHashHistory } from 'history';

const history = createHashHistory(); // Use history.push(...) to programmatically change path, for instance after successfully saving a student
export class EditRecipe extends Component<{ match: { params: { id: number } } }> {
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
  recipeContent: Recipe_Content[] = [];
  ingredients: Ingredient[] = [];

  render() {
    return (
      <>
        <Card title="Endre oppskriften">
          {/* input navn */}
          <Column>
            <Column width={2}>
              <Form.Label>Name:</Form.Label>
            </Column>
            <Column>
              <Form.Input
                type="text"
                id="recipe_name"
                value={this.recipe.oppskrift_navn}
                onChange={(event) => (this.recipe.oppskrift_navn = event.currentTarget.value)}
              />
            </Column>
          </Column>
          {/* input beksrivelse */}
          <Column>
            <Column width={2}>
              <Form.Label>Description:</Form.Label>
            </Column>
            <Column>
              <Form.Textarea
                id="recipe_description"
                style={{ width: '300px' }}
                type="text"
                value={this.recipe.oppskrift_beskrivelse}
                onChange={(event) =>
                  (this.recipe.oppskrift_beskrivelse = event.currentTarget.value)
                }
                rows={5}
              />
            </Column>
          </Column>
          {/* input steg */}
          <Column>
            <Column width={2}>
              <Form.Label>Steg:</Form.Label>
            </Column>
            <Column>
              <Form.Textarea
                id="recipe_step"
                style={{ width: '600px' }}
                type="text"
                value={this.recipe.oppskrift_steg}
                onChange={(event) => (this.recipe.oppskrift_steg = event.currentTarget.value)}
                rows={10}
              />
            </Column>
          </Column>
          {/* input antall porsjoner */}
          <Column>
            <Column width={2}>
              <Form.Label>Porjsoner:</Form.Label>
            </Column>
            <Column>
              <Form.Input
                id="recipe_portions"
                type="number"
                value={this.recipe.ant_pors}
                //@ts-ignore
                onChange={(event) => (this.recipe.ant_pors = event.currentTarget.value)}
              />
            </Column>
          </Column>
          {/* input bilde url */}
          <Column>
            <Column width={2}>
              <Form.Label>Bilde url:</Form.Label>
            </Column>
            <Column>
              <Form.Input
                id="recipe_image"
                type="text"
                value={this.recipe.bilde_adr}
                onChange={(event) => (this.recipe.bilde_adr = event.currentTarget.value)}
              />
            </Column>
          </Column>

          {/* renderer alle ingrediensene som er linket til oppskriften, her kan man også endre på hvor mye det er av hver ingrediens og måleenheten */}
          <Column>
            <div id="outprintIngredient">
              {this.recipeContent.map((rc, i) => (
                <p key={i}>
                  {/* {this.ingredients.filter((ing) => rc.ingred_id == ing.ingred_id)[0].ingred_navn}{' '} */}
                  <input
                    style={{ width: '50px' }}
                    type="number"
                    value={rc.mengde}
                    onChange={(event) => (
                      //@ts-ignore
                      (rc.mengde = event.currentTarget.value), console.log(this.recipeContent)
                    )}
                  />
                  <input
                    style={{ width: '100px' }}
                    type="text"
                    value={rc.maleenhet}
                    onChange={(event) => (
                      //@ts-ignore
                      (rc.maleenhet = event.currentTarget.value), console.log(this.recipeContent)
                    )}
                  />
                  <Button.Danger
                    onClick={() => this.deleteIngredient(rc.oppskrift_id, rc.ingred_id)}
                  >
                    x
                  </Button.Danger>
                </p>
              ))}{' '}
            </div>
          </Column>
          {/* print ut alle ingrediense som allerede er i databasen */}
          {/* vidre ideer her er at vi setter en viss lengde og bredde på diven og så hvis den overflower så må man bare skulle 
          nedover, her kan vi også implementere et søkefelt etterhvert for ingredienser. */}
          <Column>
            Ingrediensene som allered er lagret,
            <br /> hvis ingrediensen din ikke er her kan du legge den til!
            <br />
            <Column>
              {this.ingredients.map((ingredient) => (
                <>
                  <Button.Light
                    id={ingredient.ingred_id}
                    key={ingredient.ingred_id}
                    onClick={() => {
                      this.addIngredientFunc(ingredient.ingred_id, this.props.match.params.id);
                    }}
                  >
                    {ingredient.ingred_navn}
                  </Button.Light>
                </>
              ))}
            </Column>
          </Column>
        </Card>
        <Button.Success onClick={() => this.pushNewChanges()}>Endre oppskrift</Button.Success>
        <Button.Danger
          id="cancelEdit"
          onClick={() => history.push('/recipe/' + this.props.match.params.id)}
        >
          Cancel
        </Button.Danger>
      </>
    );
  }

  //legger til nye ingredienser, sjekker først om de finnes, så legger den til i databasen og så blir det hentet ned igjen
  addIngredientFunc(ingred_id: number, recipe_id: number) {
    //sjekker om ingrediensen allerede finnes i oppskriften
    const ifExist = this.recipeContent.map((element) =>
      element.ingred_id == ingred_id ? true : false
    );
    //hvis ingrediensen ikke finnes i oppskriften vil den bli lagt til
    if (!ifExist.includes(true)) {
      const add = { oppskrift_id: recipe_id, ingred_id: ingred_id, mengde: 0, maleenhet: '' };

      //gjennbruker .createRecipeIngredient, den forventer et array så pakker da add inn i et array
      service
        .createRecipeIngredient([add])
        .then(() => this.getIngredRecipe())
        .catch((error) => Alert.danger('Error getting ingredients: ' + error.message));
    } else {
      Alert.info('denne ingrediensen finnes allerede i oppskriften');
    }
  }
  //lager en egen funksjon for å hente ingrediensene til en oppskrift fordi jeg bruker den to steder, praktisk
  getIngredRecipe() {
    service
      .getRecipeContent(this.props.match.params.id)
      .then((recipeContent) => (this.recipeContent = recipeContent))
      .catch((error) => Alert.danger('Error getting recipe content: ' + error.message));
  }
  pushNewChanges() {
    console.log('nå sendes objektet', this.recipeContent);
    service
      .updateRecipe(this.recipe)
      .catch((error) => Alert.danger('Error updating recipe info: ' + error.message));
    service
      .updateRecipeIngredient(this.recipeContent)
      .then(() => history.push('/recipe/' + this.props.match.params.id))
      .catch((error) => Alert.danger('Error updating recipe content: ' + error.message));
  }
  deleteIngredient(recipe_id: number, ingred_id: number) {
    service
      .deleteIngredient(recipe_id, ingred_id)
      .then(() => this.getIngredRecipe())
      .catch((error) => Alert.danger('Error getting ingredients: ' + error.message));
  }
  mounted() {
    service
      .getAllIngredient()
      .then(
        (ingredients) => (
          console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', ingredients),
          (this.ingredients = ingredients)
        )
      )
      .then(() => console.log('fittefaen1'))
      .catch((error) => {
        console.log(error);
        Alert.danger('Error getting ingredients: ' + error.message);
      });

    service
      .getRecipeContent(this.props.match.params.id)
      .then((recipeContent) => (this.recipeContent = recipeContent))
      .then(() => console.log('fittefaen2'))
      .catch((error) => Alert.danger('Error getting recipe content: ' + error.message));

    service
      .getRecipe(this.props.match.params.id)
      .then((recipe) => {
        this.recipe = recipe[0];
      })
      .then(() => console.log('fittefaen3'))
      .catch((error) => Alert.danger('Error getting recipe: ' + error.message));
  }
}
