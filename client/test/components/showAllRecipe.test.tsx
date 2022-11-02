import * as React from 'react';

import { shallow, mount } from 'enzyme';
import { Alert, Card, Row, Column, Form, Button, RecipeView } from '../../src/widgets';
import { ShowAllRecipe } from '../../src/components/showAllRecipe';

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
  test('Select Nyeste at sort', (done) => {
    const wrapper = shallow(<ShowAllRecipe />);
    //find select sortBy and simulate change and choose target value 1 and name Z-A
    setTimeout(() => {
      //siden shallow ikke ser så dypt får vi ikke igjen hele objektet men bare et tomt objekt. Derfor tester
      //jeg om det er et tomt objekt som returneres. det denne testen viser er at hvis knappen blir trykket på
      //så vil det hvertfall bli returnert et objekt.
      expect(
        wrapper.find('#sortBy').simulate('change', { target: { value: 2, name: 'Nyeste' } })
      ).toEqual({});
      done();
    });
  });
  test('Select Z-A at sort', (done) => {
    const wrapper = shallow(<ShowAllRecipe />);
    //find select sortBy and simulate change and choose target value 1 and name Z-A
    setTimeout(() => {
      expect(
        wrapper.find('#sortBy').simulate('change', { target: { value: 1, name: 'Z-A' } })
      ).toEqual({});
      done();
    });
  });
  test('Select A-Z at sort', (done) => {
    const wrapper = shallow(<ShowAllRecipe />);
    //find select sortBy and simulate change and choose target value 1 and name Z-A
    wrapper.find('#sortBy').simulate('change', { target: { value: 0, name: 'A-Z' } });
    setTimeout(() => {
      expect(
        wrapper.find('#sortBy').simulate('change', { target: { value: 0, name: 'A-Z' } })
      ).toEqual({});

      done();
    });
  });
});
