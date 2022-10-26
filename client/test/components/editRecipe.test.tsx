import * as React from 'react';

import { shallow, mount } from 'enzyme';
import { Alert, Card, Row, Column, Form, Button, RecipeView } from '../../src/widgets';
import { NavLink } from 'react-router-dom';
import { EditRecipe } from '../../src/components/editRecipe';
import service from '../../src/service';
const mock_addCountry = document.createElement('input');

import { createHashHistory } from 'history';

const history = createHashHistory();
jest.mock('../../src/service', () => {
  class Service {
    getAllCountry() {
      return Promise.resolve([
        {
          land_id: 1,
          land_navn: 'Sverige',
        },
        {
          land_id: 2,
          land_navn: 'Italia',
        },
      ]);
    }
    getAllCategory() {
      return Promise.resolve([
        {
          kategori_id: 1,
          kategori_navn: 'Ikea mat',
        },
        {
          kategori_id: 2,
          kategori_navn: 'enkelt',
        },
      ]);
    }
    getAllIngredient() {
      return Promise.resolve([
        {
          ingred_id: 1,
          ingred_navn: 'pizzadeig',
        },
        {
          ingred_id: 2,
          ingred_navn: 'pizza fyll',
        },
        {
          ingred_id: 3,
          ingred_navn: 'kjøttboller',
        },
      ]);
    }
    getRecipe(id: number) {
      return Promise.resolve({
        oppskrift_id: 1,
        oppskrift_navn: 'Pizza',
        oppskrift_beskrivelse: 'Pizza er god og enkel',
        oppskrift_steg: 'Bland deigen og la den heve',
        ant_pors: 4,
        bilde_adr: 'pizza.jpg',
        kategori_id: 2,
        land_id: 2,
        ant_like: 1,
      });
    }

    getRecipeContent(id: number) {
      return Promise.resolve([
        {
          oppskrift_id: 1,
          ingred_id: 1,
          mengde: 1,
          maleenhet: 'stk',
        },
        {
          oppskrift_id: 1,
          ingred_id: 2,
          mengde: 1,
          maleenhet: 'håndfull',
        },
        {
          oppskrift_id: 1,
          ingred_id: 3,
          mengde: 400,
          maleenhet: 'g',
        },
      ]);
    }
    deleteRecipe(id: number) {
      return Promise.resolve();
    }
    createIngredient() {
      return Promise.resolve();
    }
    createRecipe() {
      return Promise.resolve(1);
    }
    updateRecipe() {
      return Promise.resolve();
    }
    updateRecipeIngredient() {
      return Promise.resolve();
    }
  }
  return new Service();
});
describe('editRecipe test', () => {
  test.skip('delete ingredent', (done) => {
    expect(service.deleteIngredient(1, 1)).resolves.toBeUndefined();
    done();
  });
  test.skip('change name on recipe and cancel change', (done) => {
    const wrapper = shallow(<EditRecipe match={{ params: { id: 1 } }} />);
    wrapper.find('#cancelEdit').simulate('click');
    setTimeout(() => {
      expect(window.location.href).toEqual('http://localhost/#/recipe/1');
      done();
    });
  });
  test('editRecipe should render', (done) => {
    const wrapper = shallow(<EditRecipe match={{ params: { id: 1 } }} />);
    console.log(wrapper.debug());
    done();
  });
  test.skip('change name, description, steps on recipe and confirm change', (done) => {
    const wrapper = shallow(<EditRecipe match={{ params: { id: 1 } }} />);
    wrapper.find('#recipe_name').simulate('change', { currentTarget: { value: 'Pizzaaaa' } });
    wrapper
      .find('#recipe_description')
      .simulate('change', { currentTarget: { value: 'digg mat' } });
    wrapper.find('#recipe_step').simulate('change', { currentTarget: { value: 'lag piazz' } });
    wrapper.find('#recipe_portions').simulate('change', { currentTarget: { value: '1' } });
    wrapper.find('#recipe_image').simulate('change', { currentTarget: { value: '' } });
    wrapper.find(Button.Success).simulate('click');
    setTimeout(() => {
      expect(window.location.href).toEqual('http://localhost/#/recipe/1');
      done();
    });
  });
});
