import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { MDBNavLink, MDBBtn } from 'mdbreact';
import List from './List';
import Edit from './Edit';

export default function Categories({ match }) {
  return (
    <React.Fragment>
      <div className='rightBordered'>
        <h3>Управление категориями</h3>
        <br />
        <div
          className='btn-group btn-group-lg'
          role='group'
          aria-label='Games admin buttons'
        >
          <MDBNavLink to={`/admin/categories/create`}>
            <MDBBtn color='unique' className='admin-buttons'>
              Создать категорию
            </MDBBtn>
          </MDBNavLink>
          <MDBNavLink to={`/admin/categories/list`}>
            <MDBBtn color='unique' className='admin-buttons'>
              Все категории
            </MDBBtn>
          </MDBNavLink>
        </div>
      </div>
      <Switch>
        <Route path={`${match.path}/`} exact component={List} />
        <Route path={`${match.path}/list`} exact component={List} />
        <Route path={`${match.path}/create`} exact component={Edit} />
        <Route
          path={`${match.path}/create/:humanId`}
          exact
          component={Edit}
        />{' '}
        */}
      </Switch>
    </React.Fragment>
  );
}
