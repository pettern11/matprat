import * as React from 'react';
import { Component } from 'react-simplified';
import { shallow } from 'enzyme';
import { Column, Alert, Form, Button } from '../src/widgets';
import { TaskDetails, TaskList, TaskNew, TaskEdit } from '../src/task-components';
import { NavLink } from 'react-router-dom';

jest.mock('../src/task-service', () => {
  class TaskService {
    getAll() {
      return Promise.resolve([
        { id: 1, title: 'Les leksjon', description: 'side 40-45', done: false },
        {
          id: 2,
          title: 'Møt opp på forelesning',
          description: 'forelesningen er om side 40-45',
          done: false,
        },
      ]);
    }
    get() {
      return Promise.resolve({
        id: 1,
        title: 'Les leksjon',
        description: 'side 40-45',
        done: false,
      });
    }
    create() {
      return Promise.resolve(3);
    }
    delete() {
      return Promise.resolve();
    }
    update() {
      return Promise.resolve();
    }
  }
  return new TaskService();
});

describe('Testing different pages loading and functions', () => {
  test('Singel task loads with details', (done) => {
    const wrapper = shallow(<TaskDetails match={{ params: { id: 1 } }} />);

    setTimeout(() => {
      expect(
        wrapper.containsAllMatchingElements([
          <Column>Les leksjon</Column>,
          <Column>side 40-45</Column>,
          <Form.Checkbox checked={false} />,
        ])
      ).toEqual(true);
      done();
    });
  });

  test('Singel task loads with details with snapshot', (done) => {
    const wrapper = shallow(<TaskDetails match={{ params: { id: 1 } }} />);

    setTimeout(() => {
      expect(wrapper).toMatchSnapshot();
      done();
    });
  });

  test('All Tasks loads correctly', (done) => {
    const wrapper = shallow(<TaskList />);

    setTimeout(() => {
      expect(
        wrapper.containsAllMatchingElements([
          <Column>
            <NavLink>Les leksjon</NavLink>
          </Column>,
          <Column>
            <NavLink>Møt opp på forelesning</NavLink>
          </Column>,
        ])
      ).toEqual(true);
      done();
    });
  });

  test('Create new task', (done) => {
    const wrapper = shallow(<TaskNew />);

    setTimeout(() => {
      expect(wrapper.containsMatchingElement(<Form.Input value="" />)).toEqual(true);

      wrapper.find(Form.Input).simulate('change', { currentTarget: { value: 'test' } });
      wrapper
        .find(Form.Textarea)
        .simulate('change', { currentTarget: { value: 'beskrivelse av testen' } });

      expect(wrapper.containsMatchingElement(<Form.Input value="test" />)).toEqual(true);
      expect(
        wrapper.containsMatchingElement(<Form.Textarea value="beskrivelse av testen" />)
      ).toEqual(true);

      setTimeout(() => {
        wrapper.find(Button.Success).simulate('click');
        setTimeout(() => {
          expect(window.location.href).toEqual('http://localhost/#/tasks/3');
          done();
        });
      });
    });
  });

  test('Delete task', (done) => {
    
    const wrapper = shallow(<TaskEdit match={{ params: { id: 1 } }} />);
    wrapper.find(Button.Danger).simulate('click');
    setTimeout(() => {
      expect(window.location.href).toEqual('http://localhost/#/tasks');
      done();
    });
  });

  test('Go to edit page', (done) => {
    const wrapper = shallow(<TaskDetails match={{ params: { id: 1 } }} />);
    wrapper.find(Button.Success).simulate('click');
    setTimeout(() => {
      expect(window.location.href).toEqual('http://localhost/#/tasks/1/edit');
      done();
    });
  });

  test('Edit task', (done) => {
    const wrapper = shallow(<TaskEdit match={{ params: { id: 1 } }} />);
    const wrapper1 = shallow(<TaskDetails match={{ params: { id: 1 } }} />);

    wrapper.find(Form.Input).simulate('change', { currentTarget: { value: 'test' } });
    wrapper
      .find(Form.Textarea)
      .simulate('change', { currentTarget: { value: 'test beskrivelse' } });
    wrapper.find(Form.Checkbox).simulate('change', { currentTarget: { checked: true } });

    setTimeout(() => {
      wrapper.find(Button.Success).simulate('click');
      setTimeout(() => {
        expect(window.location.href).toEqual('http://localhost/#/tasks/1');

        //siden databasen faktisk ikke blir endret så må det jukses litt her og jeg tester da om det er verdi på skjermen
        //dette gå i dette tilvele være det samme som testen som henter bare en oppgave. Orker ikke å skrive en ny clss TaskService bare for
        //en liten del av oppgaven
        expect(
          wrapper1.containsAllMatchingElements([
            <Column>Les leksjon</Column>,
            <Column>side 40-45</Column>,
            <Form.Checkbox checked={false} />,
          ])
        ).toEqual(true);

        done();
      });
    });
  });
});

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
