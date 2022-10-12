import * as React from 'react';
import { Component } from 'react-simplified';
import { shallow } from 'enzyme';
import { Form } from '../src/widgets';

class NameEdit extends Component {
  name = '';

  render() {
    return (
      <>
        <Form.Label>Name:</Form.Label>
        <Form.Input
          type="text"
          value={this.name}
          onChange={(event) => (this.name = event.currentTarget.value)}
        ></Form.Input>
      </>
    );
  }
}

describe('NameEdit widget tests', () => {
  test('Input updates correctly', () => {
    // const wrapper = shallow(<NameEdit />);
    // expect(wrapper).toMatchSnapshot();
    // wrapper.find(Form.Input).simulate('change', { currentTarget: { value: 'test' } });
    // expect(wrapper).toMatchSnapshot();
    // const wrapper = shallow(<NameEdit />);
    // // @ts-ignore: do not type check next line.
    // expect(wrapper.containsMatchingElement(<Form.Input value="" />)).toEqual(true);
    // wrapper.find(Form.Input).simulate('change', { currentTarget: { value: 'test' } });
    // // @ts-ignore: do not type check next line.
    // expect(wrapper.containsMatchingElement(<Form.Input value="test" />)).toEqual(true);
  });
});

import * as React from 'react';
import { Component } from 'react-simplified';
import { shallow } from 'enzyme';
import taskService, { Task } from '../src/service';

jest.mock('../src/task-service', () => {
  class TaskService {
    getAll() {
      return Promise.resolve([
        { id: 1, title: 'Les leksjon', done: false },
        { id: 2, title: 'Møt opp på forelesning', done: false },
      ]);
    }
  }
  return new TaskService();
});

class TaskList extends Component {
  tasks: Task[] = [];

  render() {
    return (
      <>
        Tasks:
        {this.tasks.map((task) => (
          <div key={task.id}>{task.title}</div>
        ))}
      </>
    );
  }

  mounted() {
    taskService.getAll().then((tasks) => (this.tasks = tasks));
  }
}

describe('Component tests', () => {
  test('TaskList draws correctly', (done) => {
    const wrapper = shallow(<TaskList />);

    // Wait for events to complete
    setTimeout(() => {
      expect(
        wrapper.containsAllMatchingElements([
          <div>Les leksjon</div>,
          <div>Møt opp på forelesning</div>,
        ])
      ).toEqual(true);

      done();
    });
  });
});
