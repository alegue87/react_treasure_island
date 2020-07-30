import './App.css';
import './main.style'

import { Button, Container, Header, Content, Footer, FlexboxGrid, Col } from 'rsuite';
import Menu from './components/Menu'

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import config  from './config/config';
import _ from 'lodash';

//import { isMenuVisible } from './components/NavBar/reducer';
//import { closeMenu } from './components/NavBar/actions';
//import NavBar from './components/NavBar';
//import SideMenu from './views/SideMenu';



window.viewPorts = {
  xs: 0, 
  sm: 480, // <=
  md: 960, // <=
  lg: 1200 // <=
}
class App extends React.Component {
  constructor(props) {
    super(props);
    this.handleSelect = this.handleSelect.bind(this);
    this.state = {
      activeKey: null,
      loading: false,
    };
  }
  handleSelect(eventKey) {
    this.setState({
      activeKey: eventKey
    });
  }
  render() {
    const { activeKey } = this.state;

    // Wait for a login with demo account
    if(config.token === undefined) {
      _.delay((state) => this.setState(state), 1000, {loading:!this.state.loading})
      return <div>Loading... {this.state.loading}</div>
    }

    return (
      <Container className="App">
        <div className='view-port'>
          <Header className='header-container'>
            <Menu appearance='inverse' onSelect={this.handleSelect} activeKey={activeKey}/>
          </Header>
          <FlexboxGrid justify='center'>
            <FlexboxGrid.Item componentClass={Col} xs={24} sm={24} lg={20} xl={15} className='main-container'>
              <Content>{this.props.children}</Content>
            </FlexboxGrid.Item>
          </FlexboxGrid>
        </div>
        <Footer className='footer-container'>Treasure Island by Robert Louis Stevenson</Footer>
      </Container>
    );
  }
}


/*
class App extends Component {
  constructor(props) {
    super(props);

    this.hideSidebar = this.hideSidebar.bind(this);
  }

  hideSidebar() {
    if (this.props.sideMenuVisible) {
      this.props.closeMenu();
    }
  }

  render() {
    return (
      <div>
        <ReduxToastr
          timeOut={4000}
          newestOnTop
          preventDuplicates
          position="top-center"
          transitionIn="fadeIn"
          transitionOut="fadeOut"
        />
        <Sidebar.Pushable>
          <SideMenu isVisible={this.props.sideMenuVisible} closeMenu={this.props.closeMenu} />
          <Sidebar.Pusher dimmed={this.props.sideMenuVisible} onClick={this.hideSidebar}>
            <NavBar />
            {this.props.children}
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </div>
    );
  }
}
*/
App.propTypes = {
  sideMenuVisible: PropTypes.bool.isRequired,
  closeMenu: PropTypes.func.isRequired,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

App.defaultProps = {
  children: null,
};

const mapStateToProps = state => ({
  //sideMenuVisible: isMenuVisible(state.navbar),
});

export default withRouter(
  connect(
    mapStateToProps,
    { /*closeMenu*/ },
  )(App),
);