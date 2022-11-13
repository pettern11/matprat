import * as React from 'react';
import { Button } from '../../src/widgets';
import { render, shallow } from 'enzyme';

describe('Button tests', () => {
  test('Button Success render', (done) => {
    const wrapper = render(
      <Button.Success onClick={() => console.log('success')}>Test button success</Button.Success>
    );

    setTimeout(() => {
      expect(wrapper).toMatchSnapshot();
      done();
    });
  });
  test('Small Button Success render', (done) => {
    const wrapper = render(
      <Button.Success small onClick={() => console.log('success')}>Test button success</Button.Success>
    );

    setTimeout(() => {
      expect(wrapper).toMatchSnapshot();
      done();
    });
  });
  test('Button Danger render', (done) => {
    const wrapper = render(
      <Button.Danger onClick={() => console.log('danger')}>Test button danger</Button.Danger>
    );

    setTimeout(() => {
      expect(wrapper).toMatchSnapshot();
      done();
    });
  });
  test('Small Button Danger render', (done) => {
    const wrapper = render(
      <Button.Danger small onClick={() => console.log('danger')}>Test button danger</Button.Danger>
    );

    setTimeout(() => {
      expect(wrapper).toMatchSnapshot();
      done();
    });
  });
  test('Button Light render', (done) => {
    const wrapper = render(
      <Button.Light id={"1"} onClick={() => console.log('light')}>
        Test button light
      </Button.Light>
    );

    setTimeout(() => {
      expect(wrapper).toMatchSnapshot();
      done();
    });
  });
  test('Small Button Light render', (done) => {
    const wrapper = render(
      <Button.Light small id={"1"} onClick={() => console.log('light')}>
        Test button light
      </Button.Light>
    );

    setTimeout(() => {
      expect(wrapper).toMatchSnapshot();
      done();
    });
  });
});
