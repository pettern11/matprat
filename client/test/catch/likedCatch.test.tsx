import * as React from 'react';

import { shallow, mount } from 'enzyme';
import { Alert, Card, Row, Column, Form, Button, RecipeView } from '../../src/widgets';
import { LikedRecipes } from '../../src/components/liked';

jest.mock('../../src/service', () => {
  class Service {
    getAllRepice() {
      return Promise.reject({
        message: 'Request failed with status code 400',
        name: 'AxiosError',
        code: 'ERR_BAD_REQUEST',
        config: {},
      });
    }
  }
  return new Service();
});

describe('LikedRecipes tests catch', () => {
  test('fail', (done) => {
    const wrapper = shallow(<LikedRecipes />);
    const alert = shallow(<Alert />);
    setTimeout(() => {
      expect(alert).toMatchSnapshot();
      console.log(alert.debug());
      done();
    });
  });
});
