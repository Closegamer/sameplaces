import React from 'react';
import { Field, reduxForm } from 'redux-form';
import {
  DatePickerField,
  TextField,
  SelectField,
  FileField
} from '../../../../fields';
import { MDBBtn } from 'mdbreact';
import store from '../../../../store';

class Form extends React.Component {
  render() {
    const { handleSubmit } = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <Field
          name='humanId'
          component={TextField}
          type='text'
          label='Id игры (auto)'
          group
          disabled
        />
        <Field
          name='description'
          component={TextField}
          type='text'
          label='Description'
          group
        />
        <Field
          name='caption'
          component={TextField}
          type='text'
          label='Caption'
          group
        />
        <Field
          name='discountType'
          component={SelectField}
          label='Discount Type'
          group
          options={[
            {
              text: 'figure',
              value: 'figure'
            },
            {
              text: 'gift',
              value: 'gift'
            }
          ]}
          search={false}
        />
        <Field
          name='discount'
          component={TextField}
          type='text'
          label='Discount (amount)'
          group
        />
        <Field
          name='promocode'
          component={TextField}
          type='text'
          label='Promocode'
          group
        />
        <Field
          name='category'
          component={SelectField}
          label='Category'
          group
          options={[
            {
              text: 'men',
              value: 'Для мужчин'
            },
            {
              text: 'women',
              value: 'Для женщин'
            },
            {
              text: 'health',
              value: 'Здоровье'
            },
            {
              text: 'goods-home',
              value: 'Товары для дома'
            },
            {
              text: 'banks',
              value: 'Банки'
            },
            {
              text: 'other',
              value: 'Другое'
            }
          ]}
          search={false}
        />
        <Field
          name='link'
          component={TextField}
          type='text'
          label='Link'
          group
        />
        <Field
          name='durationType'
          component={SelectField}
          label='Duration Type'
          group
          options={[
            {
              text: 'endless',
              value: 'endless'
            },
            {
              text: 'short',
              value: 'short'
            }
          ]}
          search={false}
        />
        <Field name='duration' component={DatePickerField} label='' group />

        <Field name='bigPic' component={FileField} />
        <MDBBtn type='submit' color='unique'>
          Создать
        </MDBBtn>
      </form>
    );
  }
}

Form = reduxForm({
  form: 'createGame'
})(Form);

export default Form;
