import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Countdown, { zeroPad } from 'react-countdown-now';
import socketIOClient from 'socket.io-client';
import {
  MDBCard,
  MDBCardUp,
  MDBCardBody,
  MDBRotatingCard,
  MDBIcon,
  MDBBtn,
  MDBAlert,
  MDBRow,
  MDBCol,
  MDBContainer,
  MDBInput,
  MDBSwitch
} from 'mdbreact';
import * as playgroundActions from '../../../ducks/playground';
import * as gamesActions from '../../../ducks/games';
import '../styles.css';
import store from '../../../store';
import config from '../../../config.json';

class Single extends Component {
  static defaultProps = {
    timer: 0
  };

  state = {
    flipped: false,
    endpointHTTP: config.socketEndpointHTTP,
    endpointHTTPS: config.socketEndpointHTTPS,
    switchOn: false
  };

  contribute = singleGame => {
    const { playgroundActions } = this.props;
    playgroundActions.gameContribution(singleGame._id);
    this.goToLink(singleGame.link);
  };

  handleFlipping = () => {
    this.setState({ flipped: !this.state.flipped });
  };

  cardUpdateSocket = singleGame => {
    const endpoint =
      window.location.protocol === 'https:'
        ? this.state.endpointHTTPS
        : this.state.endpointHTTPS;
    const socket = socketIOClient(endpoint);
    socket.emit('gameCardUpdate', singleGame);
  };

  goToLink = link => {
    window.location.href = link;
  };

  render() {
    const singleGame = this.props.game;

    const index = this.props.index;

    const uploadDir = config.uploadDir;

    const colStyle = {
      height: 530,
      fontSize: 12
    };

    const timerRenderer = ({ days, hours, minutes, seconds, completed }) => {
      if (completed) {
        return <WhenTimerIsOver />;
      } else {
        return (
          <MDBContainer className='timerFiguresCont'>
            <MDBRow>
              <MDBCol size={3} className='bord'>
                <div className='timerLabel'>дней</div>
              </MDBCol>
              <MDBCol size={3} className='bord'>
                <div className='timerLabel'>часов</div>
              </MDBCol>
              <MDBCol size={3} className='bord'>
                <div className='timerLabel'>минут</div>
              </MDBCol>
              <MDBCol size={3} className='bord'>
                <div className='timerLabel'>секунд</div>
              </MDBCol>
            </MDBRow>
            <MDBRow>
              <MDBCol size={3} className='countdownDays'>
                {days}
              </MDBCol>
              <MDBCol size={3} className='countdownHrs'>
                {hours}
              </MDBCol>
              <MDBCol size={3} className='countdownMin'>
                {minutes}
              </MDBCol>
              <MDBCol size={3} className='countdownSec'>
                {seconds}
              </MDBCol>
            </MDBRow>
          </MDBContainer>
        );
      }
    };

    const WhenTimerIsOver = () => {
      const { gameActions, playgroundActions } = this.props;
      gameActions.gameStatusChange(singleGame, 'closed');

      const socket = socketIOClient(this.state.endpoint);
      const shuttle = [singleGame, 'closed'];
      socket.emit('gameStatusChange', shuttle);
      socket.emit('adminGameOverNotice', singleGame);

      return true;
    };

    return (
      <MDBRotatingCard
        flipped={this.state.flipped}
        className='text-center'
        style={colStyle}
      >
        <MDBCard className='face front'>
          <MDBCardBody>
            <div className='pict-cont'>
              <img
                className='card-img-top pictSize'
                src={`${uploadDir}${singleGame.bigPic.guid}${singleGame.bigPic.ext}`}
                alt={singleGame.caption}
              />
            </div>
            <div className='organisation-cont'>
              <p>Организация:</p>
              <h4 className='font-weight-bold mb-3 organisation'>
                {singleGame.caption}
              </h4>
            </div>
            <div className='description-cont'>
              <p>Описание:</p>
              <p>
                <b>{singleGame.description}</b>
              </p>
            </div>
            <div className='discount-cont'>
              {singleGame.discountType === 'figure' && (
                <React.Fragment>
                  <p>Скидка:</p>
                  <div className='discount'>{singleGame.discount}%</div>
                </React.Fragment>
              )}
              {singleGame.discountType === 'gift' && (
                <React.Fragment>
                  <p>Акция:</p>
                  <div className='discountGift'>Подарок</div>
                </React.Fragment>
              )}
            </div>
            <div className='promocode-cont'>
              {singleGame.promocode !== '-' && (
                <React.Fragment>
                  <p>Промокод:</p>
                  <div className='promocode'>{singleGame.promocode}</div>
                </React.Fragment>
              )}
              {singleGame.promocode === '-' && (
                <React.Fragment>
                  <p>Промокод:</p>
                  <div className='promocode'>отсутствует</div>
                </React.Fragment>
              )}
            </div>
            {/* <a
              href='#!'
              className='rotate-btn'
              data-card={`card-${index}`}
              onClick={this.handleFlipping}
            >
              <MDBIcon icon='redo' /> Подробности...
            </a> */}
          </MDBCardBody>
          <div className='timer-cont'>
            {singleGame.status === 'opened' &&
              singleGame.durationType === 'short' && (
                <React.Fragment>
                  <p>До окончания акции:</p>
                  <Countdown
                    date={singleGame.duration}
                    precision={3}
                    intervalDelay={0}
                    zeroPadTime={2}
                    daysInHours={false}
                    controlled={false}
                    renderer={timerRenderer}
                  />
                </React.Fragment>
              )}
            {singleGame.status === 'opened' &&
              singleGame.durationType === 'endless' && (
                <React.Fragment>
                  <p>Это бессрочная акция</p>
                </React.Fragment>
              )}
          </div>
          {singleGame.status === 'opened' && (
            <div className='contribute-cont'>
              <MDBBtn
                color='success'
                className='btn-wide'
                onClick={e => this.contribute(singleGame)}
              >
                Перейти
              </MDBBtn>
            </div>
          )}
          {singleGame.status !== 'opened' && (
            <div className='message-cont'>
              {singleGame.status === 'holded' && (
                <MDBAlert color='warning'>СКОРО НАЧАЛО!</MDBAlert>
              )}
              {singleGame.status === 'paused' && (
                <MDBAlert color='dark'>ОСТАНОВЛЕНО</MDBAlert>
              )}
              {singleGame.status === 'closed' && (
                <MDBAlert color='danger'>АКЦИЯ ОКОНЧЕНА</MDBAlert>
              )}
            </div>
          )}
        </MDBCard>
        <MDBCard className='face back'>
          <MDBCardUp>
            <img
              className='card-img-top'
              src={`${uploadDir}${singleGame.bigPic.guid}${singleGame.bigPic.ext}`}
              alt={singleGame.caption}
            />
          </MDBCardUp>
          <MDBCardBody>
            <h4 className='font-weight-bold'>{singleGame.caption}</h4>
            <hr />
            <p>Рыночная цена: {singleGame.marketPrice} руб.</p>
            <p>Текущая цена: {singleGame.currentPrice} руб.</p>
            <p>Описание товара: {singleGame.description}</p>
            <p>Цена участия в аукционе: {singleGame.betSize} руб.</p>
            <p>Шаг поднятия цены: {singleGame.singleStep} руб.</p>
            <MDBBtn
              color='success'
              onClick={e => this.toCart(singleGame.humanId)}
              outline
            >
              Купить за <br />
              {singleGame.marketPrice} рублей
            </MDBBtn>
            <hr />

            <a
              href='#!'
              className='rotate-btn'
              data-card={`card-${index}`}
              onClick={this.handleFlipping}
            >
              <MDBIcon icon='undo' /> Купить за меньшую цену
            </a>
          </MDBCardBody>
        </MDBCard>
      </MDBRotatingCard>
    );
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
  gameActions: bindActionCreators({ ...gamesActions }, dispatch),
  playgroundActions: bindActionCreators({ ...playgroundActions }, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Single);
