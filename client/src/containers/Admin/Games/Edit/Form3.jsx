import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { TextField, SelectField, FileField } from '../../../../fields';
import { MDBBtn } from 'mdbreact';
import store from '../../../../store';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

let Form = props => {
  const { handleSubmit } = props;

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
        name='discount'
        component={TextField}
        type='text'
        label='Discount'
        group
      />
      <Field
        name='category'
        component={SelectField}
        label='Категория'
        group
        options={[
          {
            text: 'Для мужчин',
            value: 'men'
          },
          {
            text: 'Для женщин',
            value: 'women'
          },
          {
            text: 'Здоровье',
            value: 'health'
          },
          {
            text: 'Товары для дома',
            value: 'goods-home'
          },
          {
            text: 'Банки',
            value: 'banks'
          },
          {
            text: 'Другое',
            value: 'other'
          }
        ]}
        search={false}
      />
      <Field
        name='duration'
        component={TextField}
        type='text'
        label='Duration'
        group
      />
      <Field name='link' component={TextField} type='text' label='Link' group />
      <DatePicker selected={Date.now()} onChange={this.handleChange} />

      <Field name='bigPic' component={FileField} />
      <MDBBtn type='submit' color='unique'>
        Создать
      </MDBBtn>
    </form>
  );
};

Form = reduxForm({
  form: 'createGame'
})(Form);

export default Form;
