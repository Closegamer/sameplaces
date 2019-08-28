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

// CSS Modules, react-datepicker-cssmodules.css
// import 'react-datepicker/dist/react-datepicker-cssmodules.css';

class Form extends React.Component {
  render() {
    const { handleSubmit } = this.props;
    const currentDate = new Date();
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
        <Field name='duration' component={DatePickerField} group />

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
