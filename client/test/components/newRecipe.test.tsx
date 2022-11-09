import * as React from 'react';

import { shallow, mount } from 'enzyme';
import { Alert, Card, Row, Column, Form, Button, RecipeView } from '../../src/widgets';
import { NavLink } from 'react-router-dom';
import { NewRecipe } from '../../src/components/newRecipe';
import { EditRecipe } from '../../src/components/editRecipe';
import { ShowRecipe } from '../../src/components/showRecipe';
import { LikedRecipes } from '../../src/components/liked';
import { ShoppingList } from '../../src/components/shoppingList';
const mock_addCountry = document.createElement('input');
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
      return Promise.resolve(3);
    }
    createCountry(country: string) {
      return Promise.resolve(1);
    }
    createCategory(category: string) {
      return Promise.resolve(1);
    }
    createRecipeIngredient(recipe_content: any) {
      return Promise.resolve();
    }
  }
  return new Service();
});

describe('NewRecipe tests', () => {
  test('Create recipe and push to new site', (done) => {
    const wrapper = shallow(<NewRecipe />);
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
      wrapper
        .find('#selectIngredientNewRecipe')
        .simulate('onchange', { target: { value: 'kjøttboller' } });
      wrapper.find('#btnIngredAdd').simulate('click');
      wrapper.find('#ingredNumber0').simulate('change', {
        currentTarget: { value: '1' },
      });
      wrapper.find('#ingredType0').simulate('change', {
        currentTarget: { value: 'stk' },
      });

      wrapper.find('#addRecipeBtn').simulate('click');
      setTimeout(() => {
        //expect path to be id of recipe
        expect(window.location.href).toEqual('http://localhost/#/recipe/3');
        done();
      });
    });
  });
  test('Try create recipe and fail because no ingredient', (done) => {
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
      wrapper.find('#addRecipeBtn').simulate('click');
      setTimeout(() => {
        expect(
          wrapperAlert.containsMatchingElement(
            <div>
              Du må legge til ingredienser i oppskriften din<button></button>
            </div>
          )
        ).toEqual(true);
        done();
      });
    });
  });
  test('Create ingredient and delete it', (done) => {
    const wrapper = shallow(<NewRecipe />);
    setTimeout(() => {
      wrapper.find('#createIngredient').simulate('change', {
        currentTarget: { value: 'Ost' },
      });
      expect(wrapper.find('#createIngredient').prop('value')).toEqual('Ost');

      wrapper.find('#createIngredientFunc').simulate('click');
      setTimeout(() => {
        //funksjonen går mot et databasecall
        //dette vil si at funksjonen gikk gjennom og i prosessen satte valuen tilbake til tom
        expect(wrapper.find('#createIngredient').prop('value')).toEqual('');
        done();
      });
    });
  });
  test('Create a new country', (done) => {
    const wrapper = shallow(<NewRecipe />);
    setTimeout(() => {
      wrapper.find('#addCountry').simulate('change', {
        currentTarget: { value: 'China' },
      });
      wrapper.find('#addCountryBtn').simulate('click');
      setTimeout(() => {
        expect(wrapper.find('#addCountryBtn').simulate('click')).toReturn;
        done();
      });
    });
  });
  test('Create a new category', (done) => {
    const wrapper = shallow(<NewRecipe />);
    setTimeout(() => {
      wrapper.find('#addCategory').simulate('change', {
        currentTarget: { value: 'Digg mat' },
      });
      wrapper.find('#addCategoryBtn').simulate('click');
      setTimeout(() => {
        expect(wrapper.find('#addCountryBtn').simulate('click')).toReturn;
        done();
      });
    });
  });
  test('Try create allready existing ingredient', (done) => {
    const wrapper = shallow(<NewRecipe />);
    const wrapperAlert = shallow(<Alert />);
    setTimeout(() => {
      wrapper.find('#createIngredientFunc').simulate('click');
      setTimeout(() => {
        expect(
          wrapperAlert.containsMatchingElement(
            <div>
              Ingrediensen finnes allerede eller du har ikke skrevet noe<button></button>
            </div>
          )
        ).toEqual(true);
        done();
      });
    });
  });
  //delete ingredient
  test('Delete ingredient after choosing', (done) => {
    const wrapper = shallow(<NewRecipe />);
    setTimeout(() => {
      wrapper.find('#newRecipeSearch').simulate('change', {
        currentTarget: { value: 'kjøttboller' },
      });
      wrapper.find('#btnIngredAdd').simulate('click');
      setTimeout(() => {
        //expect there to be kjøttboller in ingredient list
        expect(
          wrapper.find('#outprintIngredient').containsMatchingElement([<p>kjøttboller</p>])
        ).toEqual(true);
        //remove kjøttboller
        wrapper.find(Button.Danger).at(0).simulate('click');
        //no kjøttbolle in list
        expect(
          wrapper.find('#outprintIngredient').containsMatchingElement([<p>Kjøttboller</p>])
        ).toEqual(false);
        done();
      });
    });
  });
});
