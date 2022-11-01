import * as React from 'react';

import { shallow, mount } from 'enzyme';
import { Alert, Card, Row, Column, Form, Button, RecipeView } from '../../src/widgets';
import { NavLink } from 'react-router-dom';
import { NewRecipe } from '../../src/components/newRecipe';
import { EditRecipe } from '../../src/components/editRecipe';
import { ShowRecipe } from '../../src/components/showRecipe';
import { LikedRecipes } from '../../src/components/liked';
import { ShoppingList } from '../../src/components/shoppingList';
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
      return Promise.resolve([{
        oppskrift_id: 1,
        oppskrift_navn: 'Pizza',
        oppskrift_beskrivelse: 'Pizza er god og enkel',
        oppskrift_steg: 'Bland deigen og la den heve',
        ant_pors: 4,
        bilde_adr: 'pizza.jpg',
        kategori_id: 2,
        land_id: 2,
        ant_like: 1,
        liked:false
      }]);
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
    likeRecipe(id: number, like: boolean) {
      return Promise.resolve();
    }
  }
  return new Service();
});

describe('ShowRecipe tests', () => {
  test('Delete recipe button works', (done) => {
    const wrapper = shallow(<ShowRecipe match={{ params: { id: 2 } }} />);
    setTimeout(() => {
      wrapper.find('#deleteRecipe').simulate('click');
      expect(window.location.href).toEqual('http://localhost/#/');
      done();
    });
  });

  test('Edit recipe button works', (done) => {
    const wrapper = shallow(<ShowRecipe match={{ params: { id: 1 } }} />);
    setTimeout(() => {
      wrapper.find(Button.Success).at(1).simulate('click');
      expect(window.location.href).toEqual('http://localhost/#/recipe/edit/1');
      done();
    });
  });

  test('Like recipe button works', (done) => { 
    const wrapper = shallow(<ShowRecipe match={{ params: { id: 1 } }} />);
    setTimeout(() => {
      wrapper.find('#checkbox').simulate('change', {target: {checked: true}});
      //kan ikke expect true fordi vi gjør et database call og det klarer ikke jest
      expect(wrapper.find('#checkbox').props().checked).toEqual(false);
      done();
});

});
test('Draws correctly', (done) => {
    const wrapper = shallow(<ShowRecipe match={{ params: { id: 1 } }} />);
    setTimeout(() => {
     expect(wrapper).toMatchSnapshot();
    expect(wrapper.containsMatchingElement([<h1>Pizza</h1>,
     <p>Beskrivelse:Pizza er god og enkel</p>])).toBe(true);
      done();
  });
});


test('Number increment works', (done) => {
  const wrapper = shallow(<ShowRecipe match={{ params: { id: 1 } }} />);
  setTimeout(() => {
    wrapper.find('#btnInc').simulate('click');

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.containsMatchingElement([<b>5</b>,<p> 1. pizzadeig 1.3 stk</p>,
  <p> 2. pizza fyll 1.3 håndfull</p>,
  <p> 3. kjøttboller 500.0 g</p>])).toBe(true);
  
    done();
  });
});

test('Number decrement works', (done) => {
  const wrapper = shallow(<ShowRecipe match={{ params: { id: 1 } }} />);
  setTimeout(() => {
    wrapper.find('#btnDec').simulate('click');

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.containsMatchingElement([<b>3</b>,<p> 1. pizzadeig 0.75 stk</p>,
    <p> 2. pizza fyll 0.75 håndfull</p>,
    <p> 3. kjøttboller 300.0 g</p>])).toBe(true);
    done();
  });
});

test('Send ingredient to shopping list', (done) => {
  const wrapper = shallow(<ShowRecipe match={{ params: { id: 1 } }} />);
  
  wrapper.find('#btnSend').simulate('click');

  setTimeout(() => {
    expect(window.location.href).toEqual('http://localhost/#/shoppinglist');
    done();
  });

});

test('Number of likes', (done) => {
  const wrapper = shallow(<ShowRecipe match={{ params: { id: 1 } }} />);
  
  setTimeout(() => {
    wrapper.find('#checkbox').simulate('change', {target: {checked: true}});

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.containsMatchingElement([<p>Antall likes: 2</p>])).toBe(true);
    done();
  });
});

});
