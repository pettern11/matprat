import * as React from 'react';

import { shallow, mount } from 'enzyme';
import { Alert, Card, Row, Column, Form, Button, RecipeView } from '../../src/widgets';
import { ShowRecipe } from '../../src/components/showRecipe';

import { createHashHistory } from 'history';

jest.mock('../../src/service', () => {
  class Service {
    getAllCountry() {
      return Promise.reject({ message: 500 });
    }
    getAllCategory() {
      return Promise.reject({ message: 500 });
    }
    getAllIngredient() {
      return Promise.reject({ message: 500 });
    }
    getAllRepice(id: number) {
      return Promise.reject({ message: 500 });
    }
    getRecipe(id: number) {
      return Promise.reject({ message: 500 });
    }

    getRecipeContent(id: number) {
      return Promise.reject({ message: 500 });
    }
    deleteRecipe(id: number) {
      return Promise.reject({ message: 500 });
    }
    createIngredient() {
      return Promise.reject({ message: 500 });
    }
    addIngredient(ingredient: any) {
      return Promise.reject({ message: 500 });
    }
    createRecipe() {
      return Promise.reject({ message: 500 });
    }
    likeRecipe(id: number, like: boolean) {
      return Promise.reject({ message: 500 });
    }
  }
  return new Service();
});

describe('ShowRecipe tests', () => {
  test('getRecipe throw error', (done) => {
    const wrapperAlert = shallow(<Alert />);
    const wrapper = shallow(<ShowRecipe match={{ params: { id: 1 } }} />);
    setTimeout(() => {
      //expect the route to be the same as start
      console.log(wrapperAlert.debug());
      expect(window.location.href).toEqual('http://localhost/#/');
      done();
    });
  });
});
