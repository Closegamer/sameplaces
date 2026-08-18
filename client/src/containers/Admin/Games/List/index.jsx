import React, { Component } from 'react';
import { connect } from 'react-redux';
import { MDBBtn, MDBSpinner, MDBIcon } from 'mdbreact';
import { bindActionCreators } from 'redux';
import * as gamesActions from '../../../../ducks/games';
import * as playgroundActions from '../../../../ducks/playground';
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
    actions.loadGames();
  }

  statusChange = (game, newStatus) => {
    const { actions } = this.props;
    actions.gameStatusChange(game, newStatus);

    const endpoint =
      window.location.protocol === 'https:'
        ? this.state.endpointHTTPS
        : this.state.endpointHTTPS;
    const socket = socketIOClient(endpoint);
    const shuttle = [game, newStatus];
    socket.emit('gameStatusChange', shuttle);
  };

  deleteCurrentGame = humanId => {
    const { actions } = this.props;
    actions.deleteGame(humanId);

    const endpoint =
      window.location.protocol === 'https:'
        ? this.state.endpointHTTPS
        : this.state.endpointHTTPS;
    const socket = socketIOClient(endpoint);
    socket.emit('gameDemolition', humanId);
  };

  render() {
    const { games, gamesLoadingInProgress, gamesLoadingError } = this.props;

    if (!!gamesLoadingError) return <div>{gamesLoadingError}</div>;

    if (gamesLoadingInProgress) return <MDBSpinner />;

    return (
      <React.Fragment>
        {!games[0] ? (
          <div>Нету</div>
        ) : (
          <div className='monitor-cont'>
            <h4>Все Игры</h4>
            <table className='table table-striped text-center'>
              <thead>
                <tr>
                  <th scope='col'>HumanId</th>
                  <th scope='col'>BigPic</th>
                  <th scope='col'>Category</th>
                  <th scope='col'>Caption</th>
                  <th scope='col'>Description</th>
                  <th scope='col'>Discount</th>
                  <th scope='col'>Times Clicked</th>
                  <th scope='col'>Status</th>
                  <th scope='col'>Duration</th>
                  <th scope='col'>Controls</th>
                </tr>
              </thead>
              <tbody>
                {games.map((game, index) => {
                  return (
                    <tr key={index}>
                      <td>{game.humanId}</td>
                      <td>
                        {game.bigPic && game.bigPic.guid && game.bigPic.ext && (
                          <img
                            alt={game.caption}
                            width={90}
                            height={90}
                            src={`${uploadDir}${game.bigPic.guid}${game.bigPic.ext}`}
                          />
                        )}
                      </td>
                      <td>{game.category}</td>
                      <td>{game.caption}</td>
                      <td>{game.description}</td>
                      <td>{game.discount}</td>
                      <td>{game.timesClicked}</td>
                      <td>{game.status}</td>
                      <td>{game.humanDuration}</td>
                      <td>
                        {game.status === 'holded' && (
                          <React.Fragment>
                            <MDBBtn
                              color='dark-green'
                              rounded
                              size='sm'
                              onClick={e => this.statusChange(game, 'opened')}
                            >
                              <MDBIcon icon='play' />
                            </MDBBtn>
                            <MDBBtn
                              color='blue-grey'
                              rounded
                              disabled
                              outline
                              size='sm'
                            >
                              <MDBIcon icon='pause' />
                            </MDBBtn>
                            <MDBBtn
                              disabled
                              color='pink'
                              rounded
                              size='sm'
                              outline
                            >
                              <MDBIcon icon='stop' />
                            </MDBBtn>
                          </React.Fragment>
                        )}
                        {game.status === 'opened' && (
                          <React.Fragment>
                            <MDBBtn
                              color='dark-green'
                              rounded
                              outline
                              disabled
                              size='sm'
                            >
                              <MDBIcon icon='play' />
                            </MDBBtn>
                            <MDBBtn
                              color='blue-grey'
                              rounded
                              size='sm'
                              onClick={e => this.statusChange(game, 'paused')}
                            >
                              <MDBIcon icon='pause' />
                            </MDBBtn>
                            <MDBBtn
                              color='pink'
                              rounded
                              size='sm'
                              onClick={e => this.statusChange(game, 'closed')}
                            >
                              <MDBIcon icon='stop' />
                            </MDBBtn>
                          </React.Fragment>
                        )}
                        {game.status === 'paused' && (
                          <React.Fragment>
                            <MDBBtn
                              color='dark-green'
                              rounded
                              size='sm'
                              onClick={e => this.statusChange(game, 'opened')}
                            >
                              <MDBIcon icon='play' />
                            </MDBBtn>
                            <MDBBtn
                              color='blue-grey'
                              rounded
                              outline
                              disabled
                              size='sm'
                            >
                              <MDBIcon icon='pause' />
                            </MDBBtn>
                            <MDBBtn
                              color='pink'
                              rounded
                              size='sm'
                              onClick={e => this.statusChange(game, 'closed')}
                            >
                              <MDBIcon icon='stop' />
                            </MDBBtn>
                          </React.Fragment>
                        )}
                        {game.status === 'closed' && (
                          <React.Fragment>
                            <MDBBtn
                              color='red'
                              rounded
                              size='sm'
                              onClick={e =>
                                this.deleteCurrentGame(game.humanId)
                              }
                            >
                              <MDBIcon icon='times' />
                            </MDBBtn>
                          </React.Fragment>
                        )}
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

const mapStateToProps = ({ games }) => ({
  games: games.list,
  gamesLoadingInProgress: games.gamesLoadingInProgress,
  gamesLoadingError: games.gamesLoadingError,
  gamesLoadedAt: games.gamesLoadedAt
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ ...gamesActions }, dispatch),
  playgroundActions: bindActionCreators({ ...playgroundActions }, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(List);
