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
        { id: 59,
          ingred_id: 1,
          mengde: 2,
          maleenhet: 'stk',
        },
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
    updateIngredientShoppingList(ingredient: List){
      return Promise.resolve();
    }
    deleteIngredientShoppingList(id: number){
      return Promise.resolve();
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
describe('Functionality input', () => {

  test('Input fields change value new item', (done)=>{
  const wrapper = shallow(<ShoppingList />);

  wrapper.find('#navn').simulate('change', { currentTarget: { value: 'Chicken' } });
  wrapper.find('#mengde').simulate('change', { currentTarget: { value: 5 } });
  wrapper.find('#maleenhet').simulate('change', { currentTarget: { value: 'stk' } });

  
   
  setTimeout(() => {
    
    expect(wrapper.find('#navn').prop('value')).toBe('Chicken');
    expect(wrapper.find('#mengde').prop('value')).toBe(5);
    expect(wrapper.find('#maleenhet').prop('value')).toBe('stk');

    done();
  });


});

  test('Input fields change value existing value', (done)=>{
  const wrapper = shallow(<ShoppingList />);
  //wrapper.find('#shoppinglistsearch').simulate('change', { currentTarget: { value: 'Pizza' } });
  //wrapper.find('#selectExistingIngredient').simulate('change', { target: { value: 1, name: 'Chicken' } });
  wrapper.find(Form.Input).at(3).simulate('change', { currentTarget: { value: 'Bee' } });
  wrapper.find(Form.Input).at(4).simulate('change', { currentTarget: { value: 5 } });
  wrapper.find(Form.Input).at(5).simulate('change', { currentTarget: { value: 'stk' } });

  console.log('gang nr 2',wrapper.debug())

  setTimeout(() => {
    expect(wrapper.find('#selectExistingIngredient')/* .simulate('change', { target: { value: 3, name: 'Beef' } }) */).toEqual({});
    expect(wrapper.find(Form.Input).at(5).prop('value')).toBe('Bee');
    expect(wrapper.find(Form.Input).at(6).prop('value')).toBe(5);
    expect(wrapper.find(Form.Input).at(7).prop('value')).toBe('stk');

    done();
  });
});

  test('Add new item to shopping list', (done)=>{
    const wrapper = shallow(<ShoppingList />)

    wrapper.find(Form.Input).at(0).simulate('change', {currentTarget: {value: 'Osteplater'}});
    wrapper.find(Form.Input).at(1).simulate('change', {currentTarget: {value: 3}});
    wrapper.find(Form.Input).at(2).simulate('change', {currentTarget: {value: 'plater'}});

    wrapper.find(Button.Success).at(1).simulate('click');

    setTimeout(()=>{
      expect(wrapper.find(Form.Input).at(2).prop('value')).toBe('Osteplater');
      expect(wrapper.find(Form.Input).at(3).prop('value')).toBe(3);
      expect(wrapper.find(Form.Input).at(4).prop('value')).toBe('plater');

      done();
    })
  });

  test('Change item mengde', (done)=>{
    const wrapper = shallow(<ShoppingList />);
    setTimeout(()=>{ // må ha en timeout her fordi den ikke klarer å finne knappen uten
      expect(wrapper.find(Form.Input).at(0).prop('value')).toBe(2);
      
      wrapper.find(Form.Input).at(0).simulate('change', { currentTarget: { value: '6.5' } });;

      expect(wrapper.find(Form.Input).at(0).prop('value')).toBe('6.5');
      
      done();
    });
  });

  test('Search for ingredient', (done)=>{
    const wrapper = shallow(<ShoppingList />);

    wrapper.find(Form.Input).at(3).simulate('change', { currentTarget: { value: 'Salmon' } });
    
    setTimeout(()=>{
      expect(wrapper.find('option').at(0).props().value).toBe(1)
      expect(wrapper.find('option').at(1).props().value).toBe(2)
      expect(wrapper.find('option').at(2).props().value).toBe(3)


      done();
    });
  });

});


describe('Functionality buttons', () => {
  test('Delete all items', (done)=>{
    const wrapper = shallow(<ShoppingList />);

    wrapper.find(Button.Danger).at(0).simulate('click');

    setTimeout(()=>{
      expect(wrapper.find(Button.Danger).at(0)).toEqual({});
      done();
    })
  });

  test('Add new item error', (done)=>{
    let spy = jest.spyOn(ShoppingList.prototype, 'addItem').mockImplementation(() => 8);

    const wrapper = shallow(<ShoppingList />);
    setTimeout(()=>{ 
      wrapper.find(Form.Input).at(6).simulate('change', { currentTarget: { value: 3 } });
      wrapper.find(Form.Input).at(7).simulate('change', { currentTarget: { value: 'stk' } });

      wrapper.find(Button.Success).at(2).simulate('click');
      setTimeout(()=>{
        console.log('gang nr 3',wrapper.debug())
        expect(wrapper.find(Form.Input).at(6).prop('value')).toBe(3);
        expect(wrapper.find(Form.Input).at(7).prop('value')).toBe('stk');
  
        expect(spy).toHaveBeenCalled();
  
        done();
      });
      done();
    });

    setTimeout(()=>{

    done();
    });
    
  });

  test('Add existing item', (done)=>{
    const wrapper = shallow(<ShoppingList />);
    setTimeout(()=>{
      wrapper.find(Button.Success).at(3).simulate('click');

      done();
    });

    setTimeout(()=>{
      expect(wrapper.find(Button.Success).at(3)).toEqual({});

      done();
    });
  });

  test('Increment mengde', (done)=>{
    const wrapper = shallow(<ShoppingList />);
    setTimeout(()=>{ // må ha en timeout her fordi den ikke klarer å finne knappen uten
      expect(wrapper.find(Form.Input).at(0).prop('value')).toBe(2);
      
      wrapper.find(Button.Success).at(0).simulate('click');

      expect(wrapper.find(Form.Input).at(0).prop('value')).toBe(3);

      expect(wrapper.find(Form.Input).at(1).prop('value')).toBe(1);
      
      wrapper.find(Button.Success).at(1).simulate('click');

      expect(wrapper.find(Form.Input).at(1).prop('value')).toBe(2);

 

      done();
    });
  });

  test('Decrement mengde', (done)=>{
    const wrapper = shallow(<ShoppingList />);
    setTimeout(()=>{ // må ha en timeout her fordi den ikke klarer å finne knappen uten
      expect(wrapper.find(Form.Input).at(0).prop('value')).toBe(2);
      
      wrapper.find(Button.Danger).at(0).simulate('click');

      expect(wrapper.find(Form.Input).at(0).prop('value')).toBe(1);

      expect(wrapper.find(Form.Input).at(1).prop('value')).toBe(1);
      
      wrapper.find(Button.Danger).at(2).simulate('click');

      expect(wrapper.find(Form.Input).at(1).prop('value')).toBe(1);

      done();
    });
  });

  test('Delete item', (done)=>{
    const wrapper = shallow(<ShoppingList />);
    setTimeout(()=>{ // må ha en timeout her fordi den ikke klarer å finne knappen uten
      wrapper.find(Button.Danger).at(1).simulate('click');

      done();
    });

    setTimeout(()=>{
      expect(wrapper.find(Button.Danger).at(1)).toEqual({});
      done();
    });
  });
});
