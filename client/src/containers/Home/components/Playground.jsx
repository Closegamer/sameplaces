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
        console.log('filter form cleared');
      }
    });
  };

  dispatchTimers = () => {
    const { actions } = this.props;
    console.log('checking for timers... from playground');
    actions.getTimers();
  };

  render() {
    const { gamesLoadingInProgress, gamesLoadingError, classes } = this.props;

    const allGames = this.props.playground;

    if (!!gamesLoadingError) return <div>{gamesLoadingError}</div>;

    if (gamesLoadingInProgress) return <MDBSpinner />;

    const colStyle = {
      minHeight: 350,
      marginBottom: 25
    };

    return (
      <MDBContainer className='playground-cont' fluid>
        <MDBRow>
          <MDBCol size={12}>
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
                    style={colStyle}
                  >
                    <div className='cardWrapper'>
                      <Single game={game} index={index} />
                    </div>
                  </MDBCol>
                );
              })}
            </MDBRow>
          </MDBCol>
        </MDBRow>
        <MDBRow>
          <MDBCol xs='12' sm='6' md='6' lg='6' xl='2' className='filterClass'>
            <Filter onSubmit={this.onFilter} />
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
