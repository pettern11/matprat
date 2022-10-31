import * as React from 'react';

import { shallow, mount } from 'enzyme';
import { Alert, Card, Row, Column, Form, Button, RecipeView } from '../../src/widgets';
import { NavLink } from 'react-router-dom';
import { EditRecipe } from '../../src/components/editRecipe';
import service from '../../src/service';

import { createHashHistory } from 'history';

const history = createHashHistory();
jest.mock('../../src/service', () => {
  class Service {
  
    getAllRecipe() {
      
  }

  return new Service();
});