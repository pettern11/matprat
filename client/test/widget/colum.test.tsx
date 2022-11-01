import * as React from 'react';
import { Column } from '../../src/widgets';
import { render, shallow } from 'enzyme';

describe('Collumn tests', () => {
  test('Collumn', (done) => {
    const wrapper = render(<Column>test</Column>);

    setTimeout(() => {
      expect(wrapper).toMatchSnapshot();
      done();
    });
  });
});
