import * as React from 'react';

import { shallow, mount } from 'enzyme';
import { Alert, Card, Button } from '../../src/widgets';
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
          ingred_navn: 'kjottboller',
        },
      ]);
    }
    getRecipe(id: number) {
      return Promise.resolve([
        {
          oppskrift_id: 1,
          oppskrift_navn: 'Pizza',
          oppskrift_beskrivelse: 'Pizza er god og enkel',
          oppskrift_steg: 'Bland deigen og la den heve',
          ant_pors: 4,
          bilde_adr: 'pizza.jpg',
          kategori_id: 2,
          land_id: 2,
          ant_like: 1,
        },
      ]);
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
  //viktig å faktisk sjekke at snapshotet blir riktig
  test('page renders correct with snapshot', (done) => {
    const wrapper = shallow(<EditRecipe match={{ params: { id: 1 } }} />);
    setTimeout(() => {
      expect(wrapper).toMatchSnapshot();
      done();
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

  test('input steps on recipe, and portions and confirm change', (done) => {
    const wrapper = shallow(<EditRecipe match={{ params: { id: 1 } }} />);

    wrapper.find('#recipe_step').simulate('change', { currentTarget: { value: 'lag piazz' } });
    wrapper.find('#recipe_portions').simulate('change', { currentTarget: { value: '1' } });

    setTimeout(() => {
      wrapper.find(Button.Success).at(1).simulate('click');
      expect(window.location.href).toEqual('http://localhost/#/recipe/1');
      done();
    });
  });

  test('delete ingredeient from recipe', (done) => {
    const wrapper = shallow(<EditRecipe match={{ params: { id: 1 } }} />);

    setTimeout(() => {
      wrapper.find(Button.Danger).at(0).simulate('click', { oppskrift_id: 1, ingred_id: 1 });

      setTimeout(() => {
        //expect outprintetingredient to be 1
        expect(wrapper.find('#outprintIngredient').length).toBe(1);
        done();
      });
    });
  });

  test('change ingredient inn recipe and save', (done) => {
    //spy on updateRecipeIngredient
    const spy = jest.spyOn(service, 'updateRecipeIngredient');
    const wrapper = shallow(<EditRecipe match={{ params: { id: 1 } }} />);
    setTimeout(() => {
      wrapper.find('#ingredNumber0').simulate('change', { currentTarget: { value: '2' } });
      wrapper.find('#ingredType0').simulate('change', { currentTarget: { value: 'bryst' } });
      setTimeout(() => {
        expect(wrapper.find('#ingredNumber0').prop('value')).toBe('2');
        expect(wrapper.find('#ingredType0').prop('value')).toBe('bryst');
        wrapper.find(Button.Success).at(1).simulate('click');
        //expect updateRecipeIngredient to be called as a spy function
        expect(spy).toHaveBeenCalled();
        done();
      });
    });
  });

  test('add ingredeient to recipe', (done) => {
    const wrapper = mount(<EditRecipe match={{ params: { id: 1 } }} />);
    setTimeout(() => {
      wrapper.find('#choseIngredient').at(0).simulate('keyDown', { key: 'ArrowDown', keyCode: 40 });
      wrapper.find('#choseIngredient').at(0).simulate('keyDown', { key: 'ArrowDown', keyCode: 40 });
      wrapper.find('#choseIngredient').at(0).simulate('keyDown', { key: 'ArrowDown', keyCode: 40 });
      wrapper.find('#choseIngredient').at(0).simulate('keyDown', { key: 'ArrowDown', keyCode: 40 });
      wrapper.find('#choseIngredient').at(0).simulate('keyDown', { key: 'Enter', keyCode: 13 });
      setTimeout(() => {
        expect(wrapper.find('#choseIngredient').at(0).first().text()).toEqual('kjottboller');
        expect(wrapper.containsMatchingElement(<p>kjottboller</p>)).toEqual(true);
        done();
      });
    });
  });
  test('create ingredent sucessfully', (done) => {
    const wrapper = shallow(<EditRecipe match={{ params: { id: 1 } }} />);
    setTimeout(() => {
      wrapper.find('#createIngredient').simulate('change', { currentTarget: { value: 'melk' } });
      wrapper.find('#createIngredientFunc').simulate('click');
      setTimeout(() => {
        expect(wrapper.find('#createIngredient').prop('value')).toBe('');
        //eneste vi får testet her er at vi endrer input feltet, klikker på knappen legg til og så sjekker vi at input feltet er tomt
        //hvis inputfeltet er tomt så er det vel en indikasjon på at ingrediensen ble lagt til fordi funksjonen blir kjørt riktig
        done();
      });
    });
  });
});
