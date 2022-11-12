import * as React from 'react';
import { findDOMNode } from 'react-dom';
import { shallow, mount, render } from 'enzyme';
import { Alert, Card, Row, Column, Form, Button, RecipeView } from '../../src/widgets';
import { Icebox } from '../../src/components/icebox';
import { NavLink } from 'react-router-dom';

jest.mock('../../src/service', () => {
  class Service {
    getAllRepice(id: number) {
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
          liked: true,
        },
        {
          oppskrift_id: 2,
          oppskrift_navn: 'Kjøttboller i brunsaus',
          oppskrift_beskrivelse: 'Kjøttboller er god og enkel',
          oppskrift_steg: 'dra til ikea og kjøp kjøttboller',
          ant_pors: 4,
          bilde_adr: 'kjøttboller.jpg',
          kategori_id: 1,
          land_id: 3,
          ant_like: 0,
          liked: false,
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
    getAllRecipeContent() {
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
          oppskrift_id: 2,
          ingred_id: 3,
          mengde: 400,
          maleenhet: 'g',
        },
      ]);
    }
    getAllIceboxIngredients() {
      return Promise.resolve([
        {
          ingred_id: 3,
          ingred_navn: 'kjøttboller',
        },
      ]);
    }
    deleteIceboxIngredient(id: number) {
      return Promise.resolve();
    }
    addIngredientToIcebox(add: { ingred_id: number; ingred_navn: string }) {
      return Promise.resolve();
    }
  }
  return new Service();
});

describe('Icebox tests', () => {
  test('Use select to filter recipes', (done) => {
    const wrapper = mount(<Icebox />);
    setTimeout(() => {
      wrapper.find('#choseIngredient').at(0).simulate('keyDown', { key: 'ArrowDown', keyCode: 40 });
      wrapper.find('#choseIngredient').at(0).simulate('keyDown', { key: 'ArrowDown', keyCode: 40 });
      wrapper.find('#choseIngredient').at(0).simulate('keyDown', { key: 'Enter', keyCode: 13 });
      setTimeout(() => {
        expect(wrapper.find('#choseIngredient').at(0).first().text()).toEqual('pizzadeig');

        done();
      });
    });
  });
  //her er det viktig å sjekke at snapshotet ser ut som det skal
  test('Snapshot Icebox draws correctly', (done) => {
    const wrapper = shallow(<Icebox />);
    setTimeout(() => {
      expect(wrapper).toMatchSnapshot();
      done();
    });
  });

  test('Test delete ingredient button', (done) => {
    const wrapper = shallow(<Icebox />);

    setTimeout(() => {
      expect(wrapper.find(Button.Danger).at(0).simulate('click')).toReturn;
      done();
    });
  });
});
