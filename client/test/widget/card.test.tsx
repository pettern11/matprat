import * as React from 'react';
import { Card } from '../../src/widgets';
import { render, shallow } from 'enzyme';

describe('Card tests', () => {
  test('Draw card', (done) => {
    const wrapper = render(<Card title={'overskrift'}>test</Card>);

    setTimeout(() => {
      expect(wrapper).toMatchSnapshot();
      done();
    });
  });
});
