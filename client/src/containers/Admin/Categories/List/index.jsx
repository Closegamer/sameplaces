import React, { Component } from 'react';
import { connect } from 'react-redux';
import { MDBBtn, MDBSpinner, MDBIcon } from 'mdbreact';
import { bindActionCreators } from 'redux';
import * as categoriesActions from '../../../../ducks/categories';
import socketIOClient from 'socket.io-client';
import '../../styles.css';
import store from '../../../../store';
import config from '../../../../config.json';

const uploadDir = config.uploadDir;

export class List extends Component {
  constructor() {
    super();
    this.state = {
      endpointHTTP: config.socketEndpointHTTP,
      endpointHTTPS: config.socketEndpointHTTPS
    };
  }
  static propTypes = {};

  componentDidMount() {
    const { actions } = this.props;
    actions.loadCategories();
  }

  deleteCurrentCategory = humanId => {
    const { actions } = this.props;
    actions.deleteCategory(humanId);

    const endpoint =
      window.location.protocol === 'https:'
        ? this.state.endpointHTTPS
        : this.state.endpointHTTPS;
    const socket = socketIOClient(endpoint);
    socket.emit('categoryDemolition', humanId);
  };

  render() {
    const {
      categories,
      categoriesLoadingInProgress,
      categoriesLoadingError
    } = this.props;

    if (!!categoriesLoadingError) return <div>{categoriesLoadingError}</div>;

    if (categoriesLoadingInProgress) return <MDBSpinner />;

    return (
      <React.Fragment>
        {!categories[0] ? (
          <div>
            <h4>Нет категорий</h4>
          </div>
        ) : (
          <div className='monitor-cont'>
            <h4>Все Категории</h4>
            <table className='table table-striped text-center'>
              <thead>
                <tr>
                  <th scope='col'>HumanId</th>
                  <th scope='col'>Picture</th>
                  <th scope='col'>NameEng</th>
                  <th scope='col'>NameRus</th>
                  <th scope='col'>Quantity</th>
                  <th scope='col'>Controls</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category, index) => {
                  return (
                    <tr key={index}>
                      <td>{category.humanId}</td>
                      <td>
                        {category.bigPic &&
                          category.bigPic.guid &&
                          category.bigPic.ext && (
                            <img
                              alt={category.NameEng}
                              width={90}
                              height={90}
                              src={`${uploadDir}${category.bigPic.guid}${category.bigPic.ext}`}
                            />
                          )}
                      </td>
                      <td>{category.nameEng}</td>
                      <td>{category.nameRus}</td>
                      <td>{category.quantity}</td>
                      <td>
                        <React.Fragment>
                          <MDBBtn
                            color='red'
                            rounded
                            size='sm'
                            onClick={e =>
                              this.deleteCurrentCategory(category.humanId)
                            }
                          >
                            <MDBIcon icon='times' />
                          </MDBBtn>
                        </React.Fragment>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({ categories }) => ({
  categories: categories.list,
  categoriesLoadingInProgress: categories.categoriesLoadingInProgress,
  categoriesLoadingError: categories.categoriesLoadingError,
  categoriesLoadedAt: categories.categoriesLoadedAt
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ ...categoriesActions }, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(List);
