import * as React from 'react';
import { Card, IceboxsCard, Oppskrifter, Mat } from '../../src/widgets';
import { render, shallow } from 'enzyme';

describe('Card tests', () => {
  test('Draw card', (done) => {
    const wrapper = render(<Card title={'overskrift'}>test</Card>);

    setTimeout(() => {
      expect(wrapper).toMatchSnapshot();
      done();
    });
  });

  test('Draw iceboxscard', (done) => {
    const wrapper = render(<IceboxsCard title={'overskrift'}>test</IceboxsCard>);

    setTimeout(() => {
      expect(wrapper).toMatchSnapshot();
      done();
    });
  });

  test('Draw Oppskrifter card', (done) => {
    const wrapper = render(<Oppskrifter title={'overskrift'}>test</Oppskrifter>);

    setTimeout(() => {
      expect(wrapper).toMatchSnapshot();
      done();
    });
  });

  test('Draw Mat card', (done) => {
    const wrapper = render(<Mat title={'overskrift'}>test</Mat>);

    setTimeout(() => {
      expect(wrapper).toMatchSnapshot();
      done();
    });
  });
});
