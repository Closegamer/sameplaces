import React, { Component } from 'react';
import { connect } from 'react-redux';
import { MDBSpinner, MDBContainer, MDBRow, MDBCol } from 'mdbreact';
import { bindActionCreators } from 'redux';
import * as gamesActions from '../../../../ducks/games';
import * as playgroundActions from '../../../../ducks/playground';
import * as categoriesActions from '../../../../ducks/categories';
import Form from './Form';
import '../../styles.css';
import config from '../../../../config.json';

export class Edit extends Component {
  constructor() {
    super();
    this.state = {
      endpoint: config.socketEndpoint
    };
  }
  static propTypes = {};

  componentDidMount() {
    const { actions, match } = this.props;

    const humanId = match.params.humanId;
    if (humanId) {
      actions.loadCategory(humanId);
    }
  }

  onSubmit = values => {
    const { categoriesActions, history } = this.props;

    return categoriesActions.createCategory(values).then(result => {
      if (result.success) {
        history.replace('/admin/categories/list');
      }
    });
  };

  render() {
    const { loadedCategory, loadedCategoryInProgress, match } = this.props;

    const humanId = match.params.humanId;

    if (!!humanId && (!loadedCategory || loadedCategoryInProgress)) {
      return <MDBSpinner />;
    }

    let initialValues = null;
    if (humanId && loadedCategory) {
      initialValues = loadedCategory;
    } else {
      initialValues = {};
    }
    return (
      <div className='monitor-cont'>
        {humanId && <h3>Редактировать категорию</h3>}
        {!humanId && <h3>Новая категория</h3>}
        <MDBContainer>
          <MDBRow>
            <MDBCol size='4'>
              <Form onSubmit={this.onSubmit} initialValues={initialValues} />
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </div>
    );
  }
}

const mapStateToProps = ({ categories }) => ({
  categoryCreationInProgress: categories.categoryCreationInProgress,
  categoryCreationError: categories.categoryCreationError,
  categoryCreatedAt: categories.categoryCreatedAt,

  loadedCategory: categories.loadedCategory,
  loadedCategoryInProgress: categories.loadedCategoryInProgress
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ ...gamesActions }, dispatch),
  playgroundActions: bindActionCreators({ ...playgroundActions }, dispatch),
  categoriesActions: bindActionCreators({ ...categoriesActions }, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Edit);
