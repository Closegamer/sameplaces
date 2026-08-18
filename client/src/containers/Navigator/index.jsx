import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toggleLoginForm, logout } from '../../ducks/auth';
import { toggleBalanceForm } from '../../ducks/balance';
import { withRouter } from 'react-router-dom';
import injectSheet from 'react-jss';
import logo from '../../img/logo_big_white.png';
import WaveComponent from '../../components/WaveComponent';
import './styles.css';

import {
  MDBNavbarBrand,
  MDBInput,
  MDBNavbar,
  MDBNavbarNav,
  MDBNavItem,
  MDBNavLink,
  MDBIcon,
  MDBSideNavItem,
  MDBSideNavCat,
  MDBSideNavNav,
  MDBSideNav
} from 'mdbreact';

export class Navigator extends Component {
  static propTypes = {
    toggleLoginForm: PropTypes.func.isRequired,
    toggleBalanceForm: PropTypes.func.isRequired,
    isLoggedIn: PropTypes.bool.isRequired
  };

  state = {
    leftMenuIsOpen: false
  };

  toggleLeftMenu = () => {
    this.setState({
      leftMenuIsOpen: !this.state.leftMenuIsOpen
    });
  };

  render() {
    const specialCaseNavbarStyles = {
      WebkitBoxOrient: 'horizontal',
      flexDirection: 'row'
    };

    const { classes, isLoggedIn, user, balance } = this.props;

    return (
      <div className='mdb-skin'>
        <MDBSideNav
          logo={logo}
          triggerOpening={this.state.leftMenuIsOpen}
          // bg='https://mdbootstrap.com/img/Photos/Others/sidenav4.jpg'
          mask='strong'
          hidden
          className={classes.root}
        >
          <li>
            <ul className='social'>
              <li>
                <a href='#!'>
                  <MDBIcon fab icon='facebook-f' />
                </a>
              </li>
              <li>
                <a href='#!'>
                  <MDBIcon fab icon='pinterest' />
                </a>
              </li>
              <li>
                <a href='#!'>
                  <MDBIcon fab icon='google-plus-g' />
                </a>
              </li>
              <li>
                <a href='#!'>
                  <MDBIcon fab icon='twitter' />
                </a>
              </li>
            </ul>
          </li>
          <MDBInput
            type='text'
            default='Search'
            style={{
              color: '#fff',
              padding: '0 10px 8px 30px',
              boxSizing: 'border-box'
            }}
          />
          <MDBSideNavNav>
            <MDBSideNavCat
              name='Submit blog'
              id='submit-blog-cat'
              icon='chevron-right'
            >
              <MDBSideNavItem>Submit listing</MDBSideNavItem>
              <MDBSideNavItem>Registration form</MDBSideNavItem>
            </MDBSideNavCat>
            <MDBSideNavCat
              iconRegular
              name='Instruction'
              id='instruction-cat'
              icon='hand-pointer'
            >
              <MDBSideNavItem>For bloggers</MDBSideNavItem>
              <MDBSideNavItem>For authors</MDBSideNavItem>
            </MDBSideNavCat>
            <MDBSideNavCat name='About' id='about-cat' icon='eye'>
              <MDBSideNavItem>Instruction</MDBSideNavItem>
              <MDBSideNavItem>Monthly meetings</MDBSideNavItem>
            </MDBSideNavCat>
            <MDBSideNavCat
              name='Contact me'
              id='contact-me-cat'
              icon='envelope'
            >
              <MDBSideNavItem>FAQ</MDBSideNavItem>
              <MDBSideNavItem>Write a message</MDBSideNavItem>
            </MDBSideNavCat>
          </MDBSideNavNav>
        </MDBSideNav>
        <MDBNavbar
          double
          expand='md'
          fixed='top'
          scrolling
          color='peach-gradient'
        >
          <div className='logo-cont text-center'>
            <MDBNavbarBrand href='/'>
              <img src={logo} className='img-fluid logo' alt='SP-logo' />
            </MDBNavbarBrand>
          </div>

          <MDBNavbarNav left>
            {/* <MDBNavItem>
              <div
                onClick={this.toggleLeftMenu}
                key='sideNavToggleA'
                style={{
                  lineHeight: '32px',
                  marginRight: '1em',
                  verticalAlign: 'middle'
                }}
              >
                <MDBIcon icon='bars' color='white' />
              </div>
            </MDBNavItem> */}
            <MDBNavItem
              active={this.props.location.pathname.includes('/rules')}
            >
              {/* <MDBNavLink to='/about'>
                <MDBIcon icon='envelope' className='d-inline-inline' />{' '}
                <div className='d-none d-md-inline'>Правила</div>
              </MDBNavLink> */}
            </MDBNavItem>
            {isLoggedIn && (
              <MDBNavItem>
                <MDBNavLink to='#!'>
                  <div className='d-md-inline'>Вы вошли как {user.nick}</div>
                </MDBNavLink>
              </MDBNavItem>
            )}
          </MDBNavbarNav>
          <MDBNavbarNav right style={specialCaseNavbarStyles}>
            {!isLoggedIn && (
              <MDBNavItem>
                <WaveComponent
                  onClick={this.props.toggleLoginForm}
                  tag='a'
                  className='nav-link'
                >
                  <MDBIcon icon='sign-in-alt' className='d-inline-inline' />{' '}
                  <div className='d-none d-md-inline'>Войти</div>
                </WaveComponent>
              </MDBNavItem>
            )}
            {isLoggedIn && (
              <React.Fragment>
                <MDBNavItem>
                  <WaveComponent
                    onClick={this.props.logout}
                    tag='a'
                    className='nav-link'
                  >
                    <MDBIcon icon='sign-out-alt' className='d-inline-inline' />{' '}
                    <div className='d-none d-md-inline'>Выйти</div>
                  </WaveComponent>
                </MDBNavItem>
                {user.role === 'admin' && (
                  <MDBNavItem
                    active={this.props.location.pathname.includes('/admin')}
                  >
                    <MDBNavLink to='/admin'>
                      <MDBIcon icon='laptop-code' className='d-inline-inline' />{' '}
                      <div className='d-none d-md-inline'>Админка</div>
                    </MDBNavLink>
                  </MDBNavItem>
                )}
              </React.Fragment>
            )}
          </MDBNavbarNav>
        </MDBNavbar>
        <div style={{ height: 60 }} />
      </div>
    );
  }
}

const mapStateToProps = ({ auth, balance }) => ({
  isLoggedIn: auth.isLoggedIn,
  user: auth.user,
  balance
});

const mapDispatchToProps = dispatch => ({
  toggleLoginForm: bindActionCreators(toggleLoginForm, dispatch),
  toggleBalanceForm: bindActionCreators(toggleBalanceForm, dispatch),
  logout: bindActionCreators(logout, dispatch)
});

const styles = {
  root: {
    '& .logo-wrapper': {
      borderBottom: 'none'
    }
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(injectSheet(styles)(Navigator)));
