import * as React from 'react';
import { Component } from 'react-simplified';
import { Alert, Card, Row, Column, Form, Button } from './widgets';
import { NavLink, Redirect } from 'react-router-dom';
import service, { Country, Category } from './service';
import { createHashHistory } from 'history';

const history = createHashHistory(); // Use history.push(...) to programmatically change path, for instance after successfully saving a student

/**
 * Renders form to create new recipe.
 */
export class NewRecipe extends Component {
  countries: Country[] = [];
  categories: Category[] = [];

  name: string = '';
  description: string = '';
  portions: number = 0;
  picture_adr: string = '';
  from_category: number | string = '';
  from_country: number | string = '';

  render() {
    return (
      <>
        <Card title="Registrer en ny oppskrift">
          {/* input navn */}
          <Row>
            <Column width={2}>
              <Form.Label>Name:</Form.Label>
            </Column>
            <Column>
              <Form.Input
                type="text"
                value={this.name}
                onChange={(event) => (this.name = event.currentTarget.value)}
              />
            </Column>
          </Row>
          {/* input beksrivelse */}
          <Row>
            <Column width={2}>
              <Form.Label>Description:</Form.Label>
            </Column>
            <Column>
              <Form.Textarea
                style={{ width: '600px' }}
                type="text"
                value={this.description}
                onChange={(event) => (this.description = event.currentTarget.value)}
                rows={10}
              />
            </Column>
          </Row>
          {/* input antall porsjoner */}
          <Row>
            <Column width={2}>
              <Form.Label>Porjsoner:</Form.Label>
            </Column>
            <Column>
              <Form.Input
                type="number"
                value={this.portions}
                onChange={(event) => (this.portions = event.currentTarget.value)}
              />
            </Column>
          </Row>
          {/* input bilde url */}
          <Row>
            <Column width={2}>
              <Form.Label>Bilde url:</Form.Label>
            </Column>
            <Column>
              <Form.Input
                type="text"
                value={this.picture_adr}
                onChange={(event) => (this.picture_adr = event.currentTarget.value)}
              />
            </Column>
          </Row>
          {/* velg land retten kommer fra */}
          <Row>
            <Column width={2}>
              <Form.Label>Land:</Form.Label>
            </Column>
            <Column>
              <select id="choseCountry" onChange={() => {}}>
                <option>ikke på liste</option>
                {this.countries.map((country) => (
                  <option key={country.land_id} value={country.land_id}>
                    {country.land_navn}
                  </option>
                ))}
              </select>
              <Form.Input
                type="text"
                value={this.from_country}
                onChange={(event) => (this.from_country = event.currentTarget.value)}
              ></Form.Input>
              {/* må lage select og options som cars */}
            </Column>
          </Row>
        </Card>
        {/* <Button.Success
          onClick={() => {
            taskService
              .create(this.title, this.description)
              .then((id) => history.push('/tasks/' + id))
              .catch((error) => Alert.danger('Error creating task: ' + error.message));
          }}
        >
          Create
        </Button.Success> */}
      </>
    );
  }

  mounted() {
    service
      .getAllCountry()
      .then((countries) => (this.countries = countries))
      .catch((error) => Alert.danger('Error getting tasks: ' + error.message));
    service
      .getAllCategory()
      .then((categories) => (this.categories = categories))
      .catch((error) => Alert.danger('Error getting tasks: ' + error.message));
  }
}
