import * as React from 'react';
import { Alert } from '../../src/widgets';
import { shallow } from 'enzyme';

describe('Alert tests', () => {
  test('Show one alert message', (done) => {
    const wrapper = shallow(<Alert />);

    Alert.danger('test');

    setTimeout(() => {
      expect(
        wrapper.matchesElement(
          <div>
            <div>
              test
              <button />
            </div>
          </div>
        )
      ).toEqual(true);

      done();
    });
  });

  test('Close singel alert message', (done) => {
    const wrapper = shallow(<Alert />);

    Alert.danger('test');

    setTimeout(() => {
      expect(
        wrapper.matchesElement(
          <div>
            <div>
              test
              <button />
            </div>
          </div>
        )
      ).toEqual(true);

      wrapper.find('button.btn-close').simulate('click');

      expect(wrapper.matchesElement(<div></div>)).toEqual(true);

      done();
    });
  });

  test('Show alert 3 message', (done) => {
    const wrapper = shallow(<Alert />);

    Alert.danger('test1');
    Alert.danger('test2');
    Alert.danger('test3');

    // Wait for events to complete
    setTimeout(() => {
      expect(
        wrapper.matchesElement(
          <div>
            <div>
              test1
              <button />
            </div>
            <div>
              test2
              <button />
            </div>
            <div>
              test3
              <button />
            </div>
          </div>
        )
      ).toEqual(true);

      done();
    });
  });

  test('Show alert 3 message and close second button', (done) => {
    const wrapper = shallow(<Alert />);

    Alert.danger('test1');
    Alert.danger('test2');
    Alert.danger('test3');

    // Wait for events to complete
    setTimeout(() => {
      expect(
        wrapper.matchesElement(
          <div>
            <div>
              test1
              <button />
            </div>
            <div>
              test2
              <button />
            </div>
            <div>
              test3
              <button />
            </div>
          </div>
        )
      ).toEqual(true);

      wrapper.find('button.btn-close').at(1).simulate('click');

      expect(
        wrapper.matchesElement(
          <div>
            <div>
              test1
              <button />
            </div>
            <div>
              test3
              <button />
            </div>
          </div>
        )
      ).toEqual(true);

      done();
    });
  });
});

  describe('Alert timeout tests', () => {

  //har set timeout på 4.5 sekunder for å vente på at alert meldingen skal forsvinne, jeg tester at den faktisk forsvinner
  test('Show 1 alert and wait until it is closed', (done) => {
    const wrapper = shallow(<Alert />);

    Alert.danger('test');

    setTimeout(() => {
      expect(
        wrapper.matchesElement(
          <div>
            <div>
              test
              <button />
            </div>
          </div>
        )
      ).toEqual(true);

      setTimeout(() => {
        expect(wrapper.matchesElement(<div></div>)).toEqual(true);

        done();
      }, 4500);
    });
  });

  //har set timeout på 4.5 sekunder for å vente på at alert meldingen skal forsvinne, jeg tester at den faktisk forsvinner
  test('Show 1 danger alert and wait until it is closed', (done) => {
    const wrapper = shallow(<Alert />);

    Alert.warning('test');

    setTimeout(() => {
      expect(
        wrapper.matchesElement(
          <div>
            <div>
              test
              <button />
            </div>
          </div>
        )
      ).toEqual(true);

      setTimeout(() => {
        expect(wrapper.matchesElement(<div></div>)).toEqual(true);

        done();
      }, 4500);
    });
  });

  //har set timeout på 4.5 sekunder for å vente på at alert meldingen skal forsvinne, jeg tester at den faktisk forsvinner
  test('Show 3 alert and wait until it is closed', (done) => {
    const wrapper = shallow(<Alert />);

    Alert.success('test1');
    Alert.success('test2');
    Alert.success('test3');

    setTimeout(() => {
      expect(
        wrapper.matchesElement(
          <div>
            <div>
              test1
              <button />
            </div>
            <div>
              test2
              <button />
            </div>
            <div>
              test3
              <button />
            </div>
          </div>
        )
      ).toEqual(true);

      setTimeout(() => {
        expect(wrapper.matchesElement(<div></div>)).toEqual(true);

        done();
      }, 4500);
    });
  });

 

});
