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
  Columns,
  Row,
  Rows,
  Form,
  Button,
  RecipeView,
  Oppskrifter,
  Mat,
} from '../widgets';

import service, { Recipe, Category, Country } from '../service';
import { createHashHistory } from 'history';
import { check } from 'prettier';

export class ShowAllRecipe extends Component {
  countries: Country[] = [];
  categories: Category[] = [];
  originalrecipes: Recipe[] = [];
  recipes: Recipe[] = [];
  searchterm: string = '';
  api: [] = [];
  render() {
    return (
      <>
        <div className="margintop">
          <br />
          <Row>
            <center>
              <Columns>
                {/* <br/> */}
                {/* <br /> */}
                {/* <Car title="Søkefelt"> */}
                <Form.Input
                  id="indexsearch"
                  style={{ width: '210px' }}
                  type="text"
                  placeholder="Søk etter oppskrift"
                  value={this.searchterm}
                  onChange={(event) => {
                    this.search(event.currentTarget.value);
                    this.searchterm = event.currentTarget.value;
                  }}
                />
                {/* </Car> */}
              </Columns>
              <Columns>
                <select
                  id="sortBy"
                  style={{ width: '210px' }}
                  // value={props.value}
                  onChange={(event) => this.sortRecipe(Number(event.target.value))}
                  className="form-select"
                >
                  <option value="0">Sorter</option>
                  <option value="1">A-Z</option>
                  <option value="2">Z-A</option>
                  <option value="3">Nyeste</option>
                  <option value="4">Land</option>
                  <option value="5">Kategori</option>
                </select>
              </Columns>
            </center>
          </Row>
          <br></br>

          <div className="container-fluid ">
            <Rows>
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
            </Rows>
          </div>
        </div>
      </>
    );
  }
  sortRecipe(value: number) {
    console.log(value);
    //@ts-ignore
    //or create element input with id indexsearch
    let aaa = document.getElementById('indexsearch') || document.createElement('input');
    aaa.setAttribute('id', 'indexsearch');
    if (value == 1) {
      //@ts-ignore
      aaa.placeholder = 'Søk etter oppskrift';
      this.recipes.sort(function (a, b) {
        const x = a.oppskrift_navn.toLowerCase();
        const y = b.oppskrift_navn.toLowerCase();
        return x < y ? -1 : x > y ? 1 : 0;
      });
    } else if (value == 2) {
      //@ts-ignore
      aaa.placeholder = 'Søk etter oppskrift';
      this.recipes.sort(function (b, a) {
        const x = a.oppskrift_navn.toLowerCase();
        const y = b.oppskrift_navn.toLowerCase();
        return x < y ? -1 : x > y ? 1 : 0;
      });
    } else if (value == 3) {
      //@ts-ignore
      aaa.placeholder = 'Søk etter oppskrift';
      this.recipes.sort(function (b, a) {
        const x = a.oppskrift_id;
        const y = b.oppskrift_id;
        return x < y ? -1 : x > y ? 1 : 0;
      });
    } else if (value == 4) {
      //@ts-ignore
      aaa.placeholder = 'Søk etter land';
    } else if (value == 5) {
      //@ts-ignore
      aaa.placeholder = 'Søk etter kategori';
    }
  }
  mounted() {
    service
      .getAllRepice()
      .then((recipes) => {
        this.originalrecipes = recipes;
        this.recipes = recipes;
      })
      .catch((error) => Alert.danger('Error getting recipes: ' + error.message));
    service
      .getAllCountry()
      .then((countries) => (this.countries = countries))
      .catch((error) => Alert.danger('Error getting countries: ' + error.message));
    service
      .getAllCategory()
      .then((categories) => (this.categories = categories))
      .catch((error) => Alert.danger('Error getting categories: ' + error.message));
  }
  search(searchterm: string) {
    let searchFilter = document.getElementById('sortBy') || document.createElement('select');
    //find searchFilter value

    console.log(Number(searchFilter.value));
    //if searchFilter is 0,1,2,3 then sort by name
    if (
      Number(searchFilter.value) == 0 ||
      Number(searchFilter.value) == 1 ||
      Number(searchFilter.value) == 2 ||
      Number(searchFilter.value) == 3
    ) {
      this.recipes = this.originalrecipes.filter((recipe) =>
        recipe.oppskrift_navn.toLowerCase().includes(searchterm.toLowerCase())
      );
    }
    //if searchFilter is 4 then sort by country
    else if (Number(searchFilter.value) == 4) {
      let countryId = this.countries.find((country) =>
        country.land_navn.toLowerCase().includes(searchterm.toLowerCase())
      );
      this.recipes = this.originalrecipes.filter((recipe) => recipe.land_id == countryId?.land_id);
    }
    //if searchFilter is 5 then sort by category
    else {
      let categoryId = this.categories.find((category) =>
        category.kategori_navn.toLowerCase().includes(searchterm.toLowerCase())
      );
      this.recipes = this.originalrecipes.filter(
        (recipe) => recipe.kategori_id == categoryId?.kategori_id
      );
    }
  }
}
