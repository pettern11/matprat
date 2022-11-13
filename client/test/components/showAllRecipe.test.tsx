import * as React from 'react';

import { shallow} from 'enzyme';
import { NavLink } from 'react-router-dom';
import { RecipeView, Cards, Rows } from '../../src/widgets';
import { ShowAllRecipe } from '../../src/components/showAllRecipe';

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
  }
  return new Service();
});

describe('ShowAllRecipe tests', () => {
  test('Snapshot showAllRecipe draws correctly', (done) => {
    const wrapper = shallow(<ShowAllRecipe />);
    setTimeout(() => {
      expect(wrapper).toMatchSnapshot();

      done();
    });
  });
  test('Search field input works', (done) => {
    const wrapper = shallow(<ShowAllRecipe />);
    wrapper.find('#indexsearch').simulate('change', { currentTarget: { value: 'Pizza' } });
    setTimeout(() => {
      expect(wrapper.find('#indexsearch').prop('value')).toBe('Pizza');
      // expect(wrapper.state('searchterm')).toBe('Pizza'));
      done();
    });
  });
  test('Select A-Z at sort', (done) => {
    const wrapper = shallow(<ShowAllRecipe />);
    //find select sortBy and simulate change and choose target value 1 and name A-Z
    wrapper.find('#sortBy').simulate('change', { target: { value: 1, name: 'A-Z' } });
    setTimeout(() => {
      expect(
        wrapper.find('#sortBy').simulate('change', { target: { value: 1, name: 'A-Z' } })
      ).toEqual({});
      expect(
        wrapper.containsMatchingElement([
          <Rows>
            <Cards title="">
              <NavLink className="black" to="/recipe/2">
                <RecipeView img="kjøttboller.jpg" name="Kjøttboller i brunsaus" numbOfPors={4} />
              </NavLink>
            </Cards>
            <Cards title="">
              <NavLink className="black" to="/recipe/1">
                <RecipeView img="pizza.jpg" name="Pizza" numbOfPors={4} />
              </NavLink>
            </Cards>
          </Rows>,
        ])
      ).toEqual(true);

      done();
    });
  });
  test('Select Z-A at sort', (done) => {
    const wrapper = shallow(<ShowAllRecipe />);
    //find select sortBy and simulate change and choose target value 2 and name Z-A
    wrapper.find('#sortBy').simulate('change', { target: { value: 2, name: 'Z-A' } });

    setTimeout(() => {
      expect(
        wrapper.find('#sortBy').simulate('change', { target: { value: 2, name: 'Z-A' } })
      ).toEqual({});
      expect(
        wrapper.containsMatchingElement([
          <Rows>
            <Cards title="">
              <NavLink className="black" to="/recipe/1">
                <RecipeView img="pizza.jpg" name="Pizza" numbOfPors={4} />
              </NavLink>
            </Cards>
            <Cards title="">
              <NavLink className="black" to="/recipe/2">
                <RecipeView img="kjøttboller.jpg" name="Kjøttboller i brunsaus" numbOfPors={4} />
              </NavLink>
            </Cards>
          </Rows>,
        ])
      ).toEqual(true);
      done();
    });
  });
  test('Select Nyeste at sort', (done) => {
    const wrapper = shallow(<ShowAllRecipe />);
    wrapper.find('#sortBy').simulate('change', { target: { value: 3, name: 'Nyeste' } });

    //find select sortBy and simulate change and choose target value 3 and name Nyeste
    setTimeout(() => {
      //expect the frist card to be kjøttboller and the second card to be pizza since the newest is kjøttboller
      //it sorts the newest based on the id
      expect(
        wrapper.containsMatchingElement([
          <Rows>
            <Cards title="">
              <NavLink className="black" to="/recipe/2">
                <RecipeView img="kjøttboller.jpg" name="Kjøttboller i brunsaus" numbOfPors={4} />
              </NavLink>
            </Cards>
            <Cards title="">
              <NavLink className="black" to="/recipe/1">
                <RecipeView img="pizza.jpg" name="Pizza" numbOfPors={4} />
              </NavLink>
            </Cards>
          </Rows>,
        ])
      ).toEqual(true);
      expect(
        wrapper.find('#sortBy').simulate('change', { target: { value: 3, name: 'Nyeste' } })
      ).toEqual({});
      done();
    });
  });
  test('Select Land at sort', (done) => {
    const wrapper = shallow(<ShowAllRecipe />);
    //find select sortBy and simulate change and choose target value 4 and name Land
    wrapper.find('#sortBy').simulate('change', { target: { value: 4, name: 'Land' } });
    setTimeout(() => {
      expect(
        wrapper.find('#sortBy').simulate('change', { target: { value: 4, name: 'Land' } })
      ).toEqual({});

      done();
    });
  });
  test('Select Kategori at sort', (done) => {
    const wrapper = shallow(<ShowAllRecipe />);
    //find select sortBy and simulate change and choose target value 5 and name kategori
    setTimeout(() => {
      wrapper.find('#sortBy').simulate('change', { target: { value: 5, name: 'Kategori' } });
      setTimeout(() => {
        expect(
          wrapper.find('#sortBy').simulate('change', { target: { value: 5, name: 'Kategori' } })
        ).toEqual({});
        //update the wrapper

        done();
      });
    });
  });
});
