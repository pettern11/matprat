import * as React from 'react';
import { NewRecipe } from '../src/components';
import { shallow } from 'enzyme';
import { Country, Category, Ingredient, Recipe, Recipe_Content } from '../src/service';
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
          land_id: 2,
          land_navn: 'enkelt',
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
  }
  return new Service();
});

describe('NewRecipe tests', () => {
  test('Create recipe', (done) => {
    const wrapper = shallow(<NewRecipe />);

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

      setTimeout(() => {
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
        done();
      });
    });
  });
});
