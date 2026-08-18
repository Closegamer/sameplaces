import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { TextField, FileField } from '../../../../fields';
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
        label='Id категории (auto)'
        group
        disabled
      />
      <Field
        name='nameEng'
        component={TextField}
        type='text'
        label='nameEng'
        group
      />
      <Field
        name='nameRus'
        component={TextField}
        type='text'
        label='nameRus'
        group
      />

      <Field name='bigPic' component={FileField} />

      <MDBBtn type='submit' color='unique'>
        Создать
      </MDBBtn>
    </form>
  );
};

Form = reduxForm({
  form: 'category-form'
})(Form);

export default Form;
