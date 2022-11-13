import * as React from 'react';

import { shallow, mount } from 'enzyme';
import { Alert, Card, Row, Column, Form, Button, RecipeView } from '../../src/widgets';
import { NavLink } from 'react-router-dom';
import { ShoppingList } from '../../src/components/shoppingList';
import service, { List } from '../../src/service';

import { createHashHistory } from 'history';

const history = createHashHistory();
jest.mock('../../src/service', () => {
  class Service {
    getAllIngredient() {
      return Promise.resolve([
        {
          ingred_id: 1,
          ingred_navn: 'Chicken',
        },
        {
          ingred_id: 2,
          ingred_navn: 'Salmon',
        },
        {
          ingred_id: 3,
          ingred_navn: 'Beef',
        },
      ]);
    }
    getShoppingList() {
      return Promise.resolve([
        { id: 59, ingred_id: 1, mengde: 2, maleenhet: 'stk' },
        {
          id: 60,
          ingred_id: 2,
          mengde: 1,
          maleenhet: 'kg',
        },
      ]);
    }
    deleteAllShoppingList() {
      return Promise.resolve();
    }
    deleteShoppingList(id: number) {
      return Promise.resolve();
    }
    updateIngredientShoppingList(ingredient: List) {
      return Promise.resolve();
    }
    deleteIngredientShoppingList(id: number) {
      return Promise.resolve();
    }
    createIngredient(item: string) {
      return Promise.resolve();
    }
    addIngredient(item: any) {
      return Promise.resolve();
    }
  }
  return new Service();
});

describe('Rending', () => {
  test('Should render after snapshot', (done) => {
    const wrapper = shallow(<ShoppingList />);
    setTimeout(() => {
      expect(wrapper).toMatchSnapshot();

      done();
    });
  });
});
describe('Functionality input', () => {
  test('Change input field on ingrient in shoppinglist', (done) => {
    const wrapper = shallow(<ShoppingList />);

    setTimeout(() => {
      expect(wrapper.find(Form.Input).at(3).prop('value')).toBe(2);

      wrapper
        .find(Form.Input)
        .at(3)
        .simulate('change', { currentTarget: { value: '6.5' } });

      expect(wrapper.find(Form.Input).at(3).prop('value')).toBe('6.5');

      wrapper.find(Form.Input).at(3).simulate('onBlur');

      //wrapper.find(Button.Success).at(3).simulate('click');

      expect(wrapper.find(Form.Input).at(3).prop('value')).toEqual('6.5');

      done();
    });
  });
  test('Add new item to shopping list', (done) => {
    const wrapper = mount(<ShoppingList />);
    setTimeout(() => {
      wrapper.find('#choseIngredient').at(0).simulate('keyDown', { key: 'ArrowDown', keyCode: 40 });
      wrapper.find('#choseIngredient').at(0).simulate('keyDown', { key: 'ArrowDown', keyCode: 40 });
      wrapper.find('#choseIngredient').at(0).simulate('keyDown', { key: 'Enter', keyCode: 13 });

      wrapper
        .find('#exisitingmengde')
        .at(0)
        .simulate('change', { currentTarget: { value: 3 } });
      wrapper
        .find('#exisitingmaleenhet')
        .at(0)
        .simulate('change', { currentTarget: { value: 'plater' } });

      wrapper.find(Button.Success).at(0).simulate('click');

      setTimeout(() => {
        //får ikke testet om det er lagt til i listen siden det er et database kall
        //men kan sjekke om input feltete blir nullet ut, dette vil indikere at det er lagt til i listen
        expect(wrapper.find('#choseIngredient').at(0).first().text()).toEqual('Chicken');
        expect(wrapper.find('#exisitingmengde').at(0).prop('value')).toBe('0');
        expect(wrapper.find('#exisitingmaleenhet').at(0).prop('value')).toBe('');

        done();
      });
    });
  });

  test('Trigger onBlur on input field', (done) => {
    const wrapper = shallow(<ShoppingList />);
    setTimeout(() => {
      wrapper
        .find(Form.Input)
        .at(3)
        .simulate('change', { currentTarget: { value: 2 } });
      wrapper
        .find(Form.Input)
        .at(4)
        .simulate('change', { currentTarget: { value: 2 } });

      expect(wrapper.find(Form.Input).at(3).prop('value')).toEqual(2);

      done();
    });
  });
});

describe('Functionality buttons', () => {
  test('Delete all items', (done) => {
    const wrapper = shallow(<ShoppingList />);
    setTimeout(() => {
      wrapper.find(Button.Danger).at(4).simulate('click');

      setTimeout(() => {
        expect(wrapper.find(Button.Danger).at(4)).toEqual({});
        done();
      });
    });
  });

  test('Add existing item', (done) => {
    const wrapper = shallow(<ShoppingList />);
    const wrapperAlert = shallow(<Alert />);
    setTimeout(() => {
      wrapper.find('#createIngredient').simulate('change', { currentTarget: { value: 'Chicken' } });
      wrapper.find(Button.Success).at(1).simulate('click');

      done();
    });

    setTimeout(() => {
      console.log(wrapperAlert.debug());
      // expect(wrapper.find(Button.Success).at(3)).toEqual({});

      done();
    });
  });

  test('Increment mengde', (done) => {
    const wrapper = shallow(<ShoppingList />);
    setTimeout(() => {
      // må ha en timeout her fordi den ikke klarer å finne knappen uten
      expect(wrapper.find(Form.Input).at(3).prop('value')).toBe(2);

      wrapper.find(Button.Success).at(2).simulate('click');

      expect(wrapper.find(Form.Input).at(3).prop('value')).toBe(3);

      expect(wrapper.find(Form.Input).at(4).prop('value')).toBe(1);

      wrapper.find(Button.Success).at(3).simulate('click');

      expect(wrapper.find(Form.Input).at(4).prop('value')).toBe(2);

      done();
    });
  });

  test('Decrement mengde', (done) => {
    const wrapper = shallow(<ShoppingList />);
    setTimeout(() => {
      // må ha en timeout her fordi den ikke klarer å finne knappen uten
      expect(wrapper.find(Form.Input).at(3).prop('value')).toBe(2);

      wrapper.find(Button.Danger).at(0).simulate('click');

      expect(wrapper.find(Form.Input).at(3).prop('value')).toBe(1);

      expect(wrapper.find(Form.Input).at(4).prop('value')).toBe(1);

      wrapper.find(Button.Danger).at(2).simulate('click');

      expect(wrapper.find(Form.Input).at(4).prop('value')).toBe(1);

      done();
    });
  });

  test('Delete item', (done) => {
    const wrapper = shallow(<ShoppingList />);
    setTimeout(() => {
      // må ha en timeout her fordi den ikke klarer å finne knappen uten
      wrapper.find(Button.Danger).at(1).simulate('click');

      setTimeout(() => {
        expect(wrapper.find(Button.Danger).at(1)).toEqual({});
        done();
      });
    });
  });
});
