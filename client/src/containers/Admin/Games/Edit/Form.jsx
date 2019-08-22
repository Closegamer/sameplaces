import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { TextField, SelectField, FileField } from '../../../../fields';
import { MDBBtn } from 'mdbreact';
import store from '../../../../store';

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
        component={TextField}
        type='text'
        label='Category'
        group
      />
      <Field name='link' component={TextField} type='text' label='Link' group />
      <Field
        name='duration'
        component={TextField}
        label='Duration'
        group
        search={false}
      />

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
