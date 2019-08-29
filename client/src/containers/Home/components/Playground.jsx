import React, { Component } from 'react';
import { connect } from 'react-redux';
import { MDBSpinner, MDBCol, MDBRow, MDBContainer } from 'mdbreact';
import { bindActionCreators } from 'redux';
import * as playgroundActions from '../../../ducks/playground';
import Single from './Single';
import Filter from './Filter';
import '../styles.css';

export class Playground extends Component {
  static propTypes = {};

  componentDidMount() {
    const { gamesLoadedAt, actions } = this.props;
    if (!gamesLoadedAt) {
      setTimeout(
        actions => {
          actions.loadGames();
        },
        100,
        actions
      );
      setTimeout(() => {
        this.dispatchTimers();
      }, 200);
    }
  }

  onFilter = categories => {
    const { actions } = this.props;

    return actions.filter(categories).then(res => {
      if (res.success) {
      }
    });
  };

  dispatchTimers = () => {
    const { actions } = this.props;
    actions.getTimers();
  };

  render() {
    const { gamesLoadingInProgress, gamesLoadingError } = this.props;

    const allGames = this.props.playground;

    if (!!gamesLoadingError) return <div>{gamesLoadingError}</div>;

    if (gamesLoadingInProgress) return <MDBSpinner />;

    return (
      <MDBContainer className='playground-cont' fluid>
        <MDBRow>
          <MDBCol xs='12' sm='9' md='9' lg='9' xl='10' className='text-center'>
            {!allGames[0] ? (
              <div className='testMode'>
                <h1>
                  Площадка находится в тестовом режиме. <br />
                  Просьба проявить терпение.
                </h1>
              </div>
            ) : (
              <MDBRow>
                {allGames.map((game, index) => {
                  return (
                    <MDBCol
                      xs='12'
                      sm='4'
                      md='3'
                      lg='3'
                      xl='2'
                      key={index}
                      className='responsiveJoe_col'
                    >
                      <div className='cardWrapper'>
                        <Single game={game} index={index} />
                      </div>
                    </MDBCol>
                  );
                })}
              </MDBRow>
            )}
          </MDBCol>
          <MDBCol xs='12' sm='3' md='3' lg='3' xl='2'>
            <div className='filterClass text-center'>
              <Filter onSubmit={this.onFilter} />
            </div>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    );
  }
}

const mapStateToProps = ({ playground }) => ({
  playground: playground.list,
  gamesLoadingInProgress: playground.gamesLoadingInProgress,
  gamesLoadingError: playground.gamesLoadingError,
  gamesLoadedAt: playground.gamesLoadedAt
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ ...playgroundActions }, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Playground);
