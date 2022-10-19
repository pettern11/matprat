import * as React from 'react';
import { NewRecipe } from '../src/components';
import { Home, Menu } from '../src/index';
import { shallow } from 'enzyme';
import { Alert, Card, Row, Column, Form, Button, RecipeView, NavBar } from '../src/widgets';
import { NavLink } from 'react-router-dom';

jest.mock('../src/service', () => {
  class Service {
    getAllRepice() {
      return Promise.resolve([
        {
          oppskrift_id: 1,
          oppskrift_navn: 'pizza',
          oppskrift_beskrivelse: 'klassisk italiensk mat',
          oppskrift_steg: '1. lag pizzadeig, 2.stek pizzadeig med fyll',
          ant_pors: 4,
          bilde_adr: '',
          kategori_id: 1,
          land_id: 1,
          ant_ike: 0,
        },
        {
          oppskrift_id: 2,
          oppskrift_navn: 'Hamburger',
          oppskrift_beskrivelse: 'digg mat',
          oppskrift_steg: 'steg hamburger',
          ant_pors: 1,
          bilde_adr: '',
          kategori_id: 1,
          land_id: 1,
          ant_ike: 0,
        },
      ]);
    }
  }
  return new Service();
});

describe('Index test', () => {
  test('Menu loads correctly', (done) => {
    const wrapper = shallow(<Menu />);

    // Wait for events to complete
    setTimeout(() => {
      expect(
        wrapper.containsMatchingElement(
          <NavBar brand="MatForum">
            <NavBar.Link to="/newrecipe">Ny oppskrift</NavBar.Link>
          </NavBar>
        )
      ).toEqual(true);
      done();
    });
  });

  test('Recipes loads correctly', (done) => {
    const wrapper = shallow(<Home />);

    // Wait for events to complete
    setTimeout(() => {
      expect(
        wrapper.containsAllMatchingElements([
          <Card title="Søkefelt">
            <Form.Input></Form.Input>
          </Card>,
          <Row>
            <Column>
              <NavLink to={'/recipe/1'}>
                <RecipeView img={''} name={'pizza'} numbOfPors={4}></RecipeView>
              </NavLink>
            </Column>
          </Row>,
          <Row>
            <Column>
              <NavLink to={'/recipe/2'}>
                <RecipeView img={''} name={'Hamburger'} numbOfPors={1}></RecipeView>
              </NavLink>
            </Column>
          </Row>,
        ])
      ).toEqual(true);
      done();
    });
  });
});
