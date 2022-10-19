import * as React from 'react';
import { NewRecipe, ShowRecipe } from '../src/components';
import { shallow } from 'enzyme';
import { Alert, Card, Row, Column, Form, Button, RecipeView } from '../src/widgets';
import { NavLink } from 'react-router-dom';

const mock_addCountry = document.createElement('input');
jest.mock('../src/service', () => {
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
  }
  return new Service();
});

describe('NewRecipe tests', () => {
  test('Create recipe but no recipe and fail', (done) => {
    const wrapper = shallow(<NewRecipe />);
    const wrapperAlert = shallow(<Alert />);
    // Wait for events to complete
    setTimeout(() => {
      wrapper.find('#recipe_name_input').simulate('change', { currentTarget: { value: 'pizza' } });
      wrapper
        .find('#recipe_description_input')
        .simulate('change', { currentTarget: { value: 'Digg og enkel mat' } });
      wrapper.find('#recipe_steps_input').simulate('change', {
        currentTarget: { value: 'Lag pizza deig og ta på fyll, stek i ovnen' },
      });
      wrapper.find('#recipe_portions_input').simulate('change', {
        currentTarget: { value: 'Lag pizza deig og ta på fyll, stek i ovnen' },
      });
      wrapper.find('#recipe_picture_url_input').simulate('change', {
        currentTarget: { value: 'Lag pizza deig og ta på fyll, stek i ovnen' },
      });
      wrapper
        .find('#choseCountry')
        .at(0)
        .simulate('change', {
          target: { value: 1, name: 'Sverige' },
        });
      wrapper
        .find('#choseCategory')
        .at(0)
        .simulate('change', {
          target: { value: 2, name: 'enkelt' },
        });
      wrapper.find('#ingred1').simulate('click');
      setTimeout(() => {
        // console.log(
        //   'se herrr11111111111111111111111111111111111111111111111111111111',
        //   wrapperAlert.debug()
        // );
        // expect(
        //   wrapperAlert.containsMatchingElement(
        //     <div>
        //       Du må legge til ingredienser i oppskriften din<button></button>
        //     </div>
        //   )
        // ).toEqual(true);
        done();
      });
    });
  });
  test('Add ingredient', (done) => {
    const wrapper = shallow(<NewRecipe />);
    setTimeout(() => {
      wrapper.find('#createIngredient').simulate('change', {
        currentTarget: { value: 'Kylling' },
      });
      wrapper.find('#createIngredientFunc').simulate('click');
      setTimeout(() => {
        expect(wrapper.containsMatchingElement(<button>Kylling</button>)).toEqual(true);
      });
      done();
    });
  });
});

/* describe('ShowRecipe tests', () => {
  test('Show recipe draws correctly with params id set', (done) => {
    const wrapper = shallow(<ShowRecipe match={{ params: { id: 1 } }} />);

    done()
}
}); */
