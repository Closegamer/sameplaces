import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import emailValidator from 'email-validator';
import { connect } from 'react-redux';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { MDBCard, MDBRow, MDBCol, MDBIcon, MDBBtn } from 'mdbreact';
import { TextField, PassField, CheckBoxField } from '../../../fields';

let Filter = props => {
  const {
    handleSubmit,
    agree,
    classes,
    toggleFormType,
    error,
    submitting
  } = props;
  return (
    <form onSubmit={handleSubmit} className={classes.form}>
      <MDBCard className={classes.card}>
        <div className='text-white peach-gradient py-5 px-5 z-depth-4 form-dark'>
          <div className='text-center'>
            <h3 className='white-text mb-5 mt-4'>
              <strong>Категории</strong>
            </h3>
          </div>

          <Field
            name='cat-health'
            component={CheckBoxField}
            label={
              <label
                className='form-check-label white-text'
                htmlFor='cat-health'
              >
                Здоровье
              </label>
            }
          />
          <Field
            name='cat-men'
            component={CheckBoxField}
            label={
              <label className='form-check-label white-text' htmlFor='cat-men'>
                Для мужчин
              </label>
            }
          />
          <Field
            name='cat-women'
            component={CheckBoxField}
            label={
              <label
                className='form-check-label white-text'
                htmlFor='cat-women'
              >
                Для женщин
              </label>
            }
          />
          <Field
            name='cat-banks'
            component={CheckBoxField}
            label={
              <label
                className='form-check-label white-text'
                htmlFor='cat-banks'
              >
                Банки
              </label>
            }
          />

          <MDBRow className='d-flex align-items-center mb-4'>
            <div className='text-center mb-3 col-md-12'>
              <MDBBtn
                color='white'
                outline
                className='btn-block z-depth-1'
                type='submit'
              >
                Отфильтровать
              </MDBBtn>
            </div>
            <div className='text-center mb-3 col-md-12'>
              <MDBBtn
                color='white'
                outline
                className='btn-block z-depth-1'
                type='reset'
              >
                Очистить
              </MDBBtn>
            </div>
          </MDBRow>
        </div>
      </MDBCard>
    </form>
  );
};

Filter.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired
};

Filter.defaultProps = {
  classes: {}
};

Filter = reduxForm({
  form: 'cat-health',
  destroyOnUnmount: false
})(Filter);

const selector = formValueSelector('filter-form');

Filter = connect(state => {
  // can select values individually
  const agree = selector(state, 'agree');
  return {
    agree
  };
})(Filter);

export default Filter;
