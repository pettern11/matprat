import * as React from 'react';

import { shallow, mount } from 'enzyme';
import { Alert, Card, Row, Column, Form, Button, RecipeView } from '../../src/widgets';
import { NavLink } from 'react-router-dom';
import { ShoppingList } from '../../src/components/shoppingList';
import service from '../../src/service';

import { createHashHistory } from 'history';

const history = createHashHistory();
jest.mock('../../src/service', () => {
  class Service {
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
    getShoppingList() {
      return Promise.resolve([
        { id: 59,
          ingred_id: 1,
          mengde: 2,
          maleenhet: 'stk',
        },
        {
          id: 60,
          ingred_id: 2,
          mengde: 1,
          maleenhet: 'L',
        },
      ]);
    }

  }
  return new Service();
});

describe('Rending', () => {
  test('Should render after snapshot', (done)=>{
    const wrapper = shallow(<ShoppingList />);
    setTimeout(()=>{
      expect(wrapper).toMatchSnapshot();

      done();
    });
  })
});
describe('Functionality without database interaction', () => {
  
});