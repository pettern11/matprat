import * as React from 'react';
import userEvent from '@testing-library/user-event';
import { shallow, mount } from 'enzyme';
import { Alert, Form, Button } from '../../src/widgets';
import { ShoppingList } from '../../src/components/shoppingList';
import { List } from '../../src/service';

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

      expect(wrapper.find(Form.Input).at(3).prop('value')).toEqual('6.5');

      done();
    });
  });
  test('Add new ingredient to shopping list', (done) => {
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
        //expect wrapper to mount
        expect(wrapper.find(Button.Success).at(0).simulate('click')).toBeTruthy();
        done();
      });
    });
  });

  test('No ingredient in inputfield when creating new ingredient', (done) => {
    const wrapper = shallow(<ShoppingList />);
    const wrapperAlert = shallow(<Alert />);
    setTimeout(() => {
      wrapper.find('#createIngredient').simulate('change', { currentTarget: { value: '' } });
      wrapper.find(Button.Success).at(1).simulate('click');

      setTimeout(() => {
        expect(
          wrapperAlert.containsMatchingElement(
            <div>
              Du må fylle inn navn på ingrediensen<button></button>
            </div>
          )
        ).toEqual(true);
        done();
      });
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
  test('No ingredient, click add button get error', (done) => {
    const wrapper = shallow(<ShoppingList />);
    const wrapperAlert = shallow(<Alert />);
    setTimeout(() => {
      wrapper.find('#exisitingmengde').simulate('change', { currentTarget: { value: 2 } });
      wrapper.find(Button.Success).at(0).simulate('click');

      setTimeout(() => {
        expect(
          wrapperAlert.containsMatchingElement([
            <div>
              Du må fylle inn måleenhet<button></button>
            </div>,
          ])
        );
        // expect(wrapper.find(Button.Success).at(1)).toEqual({});
        done();
      });
    });
  });
  test('Create a new existing ingridient', (done) => {
    const wrapper = shallow(<ShoppingList />);
    const wrapperAlert = shallow(<Alert />);
    setTimeout(() => {
      wrapper.find('#createIngredient').simulate('change', { currentTarget: { value: 'Chicken' } });
      wrapper.find(Button.Success).at(1).simulate('click');

      setTimeout(() => {
        expect(
          wrapperAlert.containsMatchingElement([
            <div>
              Ingrediensen eksisterer allerede<button></button>
            </div>,
          ])
        );

        done();
      });
    });
  });
  test('Create a new ingredient', (done) => {
    const wrapper = shallow(<ShoppingList />);
    setTimeout(() => {
      wrapper.find('#createIngredient').simulate('change', { currentTarget: { value: 'Melk' } });
      wrapper.find(Button.Success).at(1).simulate('click');
    });

    setTimeout(() => {
      expect(wrapper.find(Button.Success).at(1)).toEqual({});

      done();
    });
  });

  test('Increment mengde', (done) => {
    const wrapper = shallow(<ShoppingList />);
    setTimeout(() => {
      // må ha en timeout her fordi den ikke klarer å finne knappen uten
      expect(wrapper.find(Form.Input).at(3).prop('value')).toBe(2);

      wrapper.find(Button.Success).at(2).simulate('click');

      expect(wrapper.find(Form.Input).at(3).prop('value')).toBe('3');

      expect(wrapper.find(Form.Input).at(4).prop('value')).toBe(1);

      wrapper.find(Button.Success).at(3).simulate('click');

      expect(wrapper.find(Form.Input).at(4).prop('value')).toBe('2');

      done();
    });
  });

  test('Decrement mengde', (done) => {
    const wrapper = shallow(<ShoppingList />);
    setTimeout(() => {
      // må ha en timeout her fordi den ikke klarer å finne knappen uten
      expect(wrapper.find(Form.Input).at(3).prop('value')).toBe(2);

      wrapper.find(Button.Danger).at(0).simulate('click');

      expect(wrapper.find(Form.Input).at(3).prop('value')).toBe('1');

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
  test('Onblur trigger', (done) => {
    const wrapper = shallow(<ShoppingList />);
    setTimeout(() => {
      wrapper
        .find(Form.Input)
        .at(3)
        .simulate('blur', { currentTarget: { value: 2 } });
      setTimeout(() => {
        userEvent.tab();

        setTimeout(() => {
          expect(wrapper.find(Form.Input).at(3).prop('value')).toBe(2);
          done();
        });
      });
    });
  });
});
