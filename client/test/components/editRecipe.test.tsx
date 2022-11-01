import * as React from 'react';

import { shallow, mount } from 'enzyme';
import { Alert, Card, Row, Column, Form, Button, RecipeView } from '../../src/widgets';
import { NavLink } from 'react-router-dom';
import { EditRecipe } from '../../src/components/editRecipe';
import service from '../../src/service';

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
    deleteIngredient() {
      return Promise.resolve();
    }
    createRecipeIngredient(add: []) {
      return Promise.resolve();
    }
  }

  return new Service();
});

describe('editRecipe test', () => {
  // test.skip('getAllIngredient fail', (done) => {
  //   const wrapper = shallow(<EditRecipe match={{ params: { id: 1 } }} />);
  //   let spy = jest.spyOn(EditRecipe.prototype, 'getAllIngredient').mockReturnValue(1);

  //   wrapper
  //     .getAllIngredient()
  //     .then(() => {
  //       throw new Error('error');
  //     })
  //     .catch(() => {
  //       done();
  //     });
  // });

  test.skip('add ingredent sucess', (done) => {
    const wrapper = shallow(<EditRecipe match={{ params: { id: 1 } }} />);
    //@ts-ignore
    let spy = jest.spyOn(EditRecipe.prototype, 'addIngredientFunc').mockReturnValue(1);
    setTimeout(() => {
      wrapper.find(Button.Light).at(2).simulate('click', { ingred_id: 1, recipe_id: 1 });
      setTimeout(() => {
        expect(spy).toBe(1);
        done();
      });
    });
  });
  test('save recipe fail', (done) => {
    const wrapper = shallow(<EditRecipe match={{ params: { id: 1 } }} />);
    const wrapperAlert = shallow(<Alert />);
    setTimeout(() => {
      wrapper.find(Button.Success).simulate('click');
      setTimeout(() => {
        console.log(wrapperAlert.debug());
        // expect(wrapper.find(Alert).length).toBe(1);
        done();
      });
    });
  });
  test('cancel change', (done) => {
    const wrapper = shallow(<EditRecipe match={{ params: { id: 1 } }} />);
    wrapper.find('#cancelEdit').simulate('click');
    setTimeout(() => {
      expect(window.location.href).toEqual('http://localhost/#/recipe/1');
      done();
    });
  });
  test('delete ingredeient from recipe', (done) => {
    let spy = jest.spyOn(EditRecipe.prototype, 'deleteIngredient').mockImplementation(() => 8);
    const wrapper = shallow(<EditRecipe match={{ params: { id: 1 } }} />);

    setTimeout(() => {
      wrapper.find(Button.Danger).at(0).simulate('click', { oppskrift_id: 1, ingred_id: 1 });
      //her slette vi første ingrediens i oppskriften, vi går ikke skjekket om dette faktisk går fordi siden vil kalle på getIngredRecipe()
      //men siden vi mocker den og den ikke er dynamisk så vil den ikke oppdatere seg
      //det vi kan gjøre er å sjekke om funksjonen som skal slette har blitt kalt og det kan vi gjøre ved å bruke spy
      setTimeout(() => {
        expect(spy).toHaveBeenCalled();
        done();
      });
    });
  });
  test('change name, description, steps on recipe, and inputfield and confirm change', (done) => {
    const wrapper = shallow(<EditRecipe match={{ params: { id: 1 } }} />);

    wrapper.find('#recipe_name').simulate('change', { currentTarget: { value: 'Pizzaaaa' } });
    wrapper
      .find('#recipe_description')
      .simulate('change', { currentTarget: { value: 'digg mat' } });
    wrapper.find('#recipe_step').simulate('change', { currentTarget: { value: 'lag piazz' } });
    wrapper.find('#recipe_portions').simulate('change', { currentTarget: { value: '1' } });
    wrapper.find('#recipe_image').simulate('change', { currentTarget: { value: '' } });

    setTimeout(() => {
      wrapper.find('#ingredNumber1').simulate('change', { currentTarget: { value: '3' } });
      wrapper.find('#ingredType1').simulate('change', { currentTarget: { value: 'stk' } });
      wrapper.find(Button.Success).simulate('click');
      expect(window.location.href).toEqual('http://localhost/#/recipe/1');
      done();
    });
  });
});
