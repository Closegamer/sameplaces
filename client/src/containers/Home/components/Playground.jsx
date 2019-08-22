import React, { Component } from 'react';
import { connect } from 'react-redux';
import { MDBSpinner, MDBCol, MDBRow, MDBContainer } from 'mdbreact';
import { bindActionCreators } from 'redux';
import * as playgroundActions from '../../../ducks/playground';
import * as balanceActions from '../../../ducks/balance';
import Single from './Single';
import '../styles.css';

export class Playground extends Component {
  static propTypes = {};

  componentDidMount() {
    const { gamesLoadedAt, actions } = this.props;
    if (!gamesLoadedAt) {
      setTimeout(() => {
        this.dispatchAutobetting();
      }, 100);
      setTimeout(
        actions => {
          actions.loadGames();
        },
        200,
        actions
      );
      setTimeout(() => {
        this.dispatchTimers();
      }, 300);
    }
  }

  dispatchTimers = () => {
    const { actions } = this.props;
    console.log('checking for timers... from playground');
    actions.getTimers();
  };

  dispatchAutobetting = () => {
    const { actions } = this.props;
    console.log('checking for autobettings... from playground');
    actions.checkAutobettingSwitch();
  };

  checkBalance = async () => {
    const { balanceActions } = this.props;
    const bal = await balanceActions.getBalance();
    if (bal) {
      balanceActions.setBalanceSuccess(bal);
    }
  };

  render() {
    const { gamesLoadingInProgress, gamesLoadingError } = this.props;

    const allGames = this.props.playground;

    const autobettingList = this.props.autobettingList[0];

    this.checkBalance();

    if (!!gamesLoadingError) return <div>{gamesLoadingError}</div>;

    if (gamesLoadingInProgress) return <MDBSpinner />;

    const colStyle = {
      minHeight: 550,
      marginBottom: 25
    };

    return (
      <MDBContainer className='playground-cont' fluid>
        <MDBRow>
          {allGames.map((game, index) => {
            return (
              <MDBCol
                xs='12'
                sm='4'
                md='3'
                lg='2'
                xl='2'
                key={index}
                style={colStyle}
              >
                <Single
                  game={game}
                  index={index}
                  autobettingList={autobettingList}
                />
              </MDBCol>
            );
          })}
        </MDBRow>
      </MDBContainer>
    );
  }
}

const mapStateToProps = ({ playground }) => ({
  playground: playground.list,
  gamesLoadingInProgress: playground.gamesLoadingInProgress,
  gamesLoadingError: playground.gamesLoadingError,
  gamesLoadedAt: playground.gamesLoadedAt,
  autobettingList: playground.autobettingList
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ ...playgroundActions }, dispatch),
  balanceActions: bindActionCreators({ ...balanceActions }, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Playground);
