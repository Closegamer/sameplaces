import React, { Component } from 'react';
import { connect } from 'react-redux';
import { MDBBtn, MDBSpinner, MDBAlert, MDBIcon } from 'mdbreact';
import { bindActionCreators } from 'redux';
import * as gamesActions from '../../../../ducks/games';
import * as playgroundActions from '../../../../ducks/playground';
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
      endpoint: config.socketEndpoint
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

    const socket = socketIOClient(this.state.endpoint);
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
          <div>Нет категорий</div>
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
                              src={`${uploadDir}${category.bigPic.guid}${
                                category.bigPic.ext
                              }`}
                            />
                          )}
                      </td>
                      <td>{category.nameEng}</td>
                      <td>{category.nameRus}</td>
                      <td>{category.quantity}</td>
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
