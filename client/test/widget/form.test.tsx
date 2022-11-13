import * as React from 'react';
import { Form } from '../../src/widgets';
import { render, shallow } from 'enzyme';

describe('Form tests', () => {
  test('Form label', (done) => {
    const wrapper = render(<Form.Label>Form label</Form.Label>);

    setTimeout(() => {
      expect(wrapper).toMatchSnapshot();
      done();
    });
  });
  test('Form textarea', (done) => {
    const wrapper = render(
      <Form.Textarea value={'string'} id={'1'} onChange={() => console.log('FormTextarea')}>
        FormTextarea
      </Form.Textarea>
    );

    setTimeout(() => {
      expect(wrapper).toMatchSnapshot();
      done();
    });
  });
  test('Form Checkbox', (done) => {
    const wrapper = render(
      <Form.Checkbox checked={true} onChange={() => console.log('Checkbox')}></Form.Checkbox>
    );

    setTimeout(() => {
      expect(wrapper).toMatchSnapshot();
      done();
    });
  });
  test('Form Select', (done) => {
    const wrapper = render(
      /* @ts-ignore */
      <Form.Select valule={'select'} onChange={() => console.log('selected')}>
        <option>Valg 1</option>
        <option>Valg 2</option>
      </Form.Select>
    );

    setTimeout(() => {
      expect(wrapper).toMatchSnapshot();
      done();
    });
  });
});
