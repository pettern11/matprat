import * as React from 'react';
import { Column, Columns, Colum } from '../../src/widgets';
import { render, shallow } from 'enzyme';

describe('Column tests', () => {
  //Sjekker at colum får riktig formatering med right
  test('Column', (done) => {
    const wrapper = render(<Column right>test</Column>);

    setTimeout(() => {
      expect(wrapper).toMatchSnapshot();
      done();
    });
  });

    //Sjekker at column får riktig bredde
  test('test Columns', (done) => {
    const wrapper = render(<Columns width={3}><p>test</p></Columns>);

    setTimeout(() => {
      expect(wrapper).toMatchSnapshot();
      done();
    });
  });

  //Sjekker at colum får riktig formatering med right og riktig bredde
  test('test Columns', (done) => {
    const wrapper = render(<Columns width={3} right><p>test</p></Columns>);

    setTimeout(() => {
      expect(wrapper).toMatchSnapshot();
      done();
    });
  });

  test('test Colum', (done) => {
    const wrapper = render(<Colum>test</Colum>);

    setTimeout(() => {
      expect(wrapper).toMatchSnapshot();
      done();
    });
  });

  //Sjekker at colum får riktig formatering med right
  test('test Colum with right', (done) => {
    const wrapper = render(<Colum right>test</Colum>);

    setTimeout(() => {
      expect(wrapper).toMatchSnapshot();
      done();
    });
  });
});
