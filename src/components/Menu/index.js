import React from 'react'
import ReactDOM from 'react-dom'
import { Nav, Navbar, Icon, Dropdown, Sidenav, Divider } from 'rsuite';
//import  DropdownCategories from './DropdownCategories';
import { connect } from 'react-redux';
import { bindActionsCreator } from 'redux';
import { Link } from 'react-router-dom';
import { fetchCategory } from './actions';
import { getCategoryPosts } from './reducer';
import _ from 'lodash';

import './style.css'

class Navigation extends React.Component {
  constructor(props) {
    super(props)
    this.state = { parentWidth: 2000, expanded: false, activeKey: null }

    this.handleExpandSide = this.handleExpandSide.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }

  componentDidMount() {
    this.setState({ parentWidth: ReactDOM.findDOMNode(this).parentNode.clientWidth })

    var that = this
    const debouncedHandleResize = debounce(function handleResize() {
      that.setState({ 'parentWidth': ReactDOM.findDOMNode(that).parentNode.clientWidth })
    }, 300)

    window.addEventListener('resize', debouncedHandleResize)

    const { dispatch } = this.props
    fetchCategory({categorySlug:'treasure-island'})(dispatch)

  }

  handleExpandSide(){
    this.setState({expanded: !this.state.expanded})
  }
  handleSelect(activeKey){
    this.setState({activeKey: String(activeKey)})
  }

  render() {

    const { posts } = this.props;
    const { expanded } = this.state;

    if (this.state.parentWidth < window.viewPorts.sm) {
      return (
        <Sidenav
          appearance='inverse'
          expanded={expanded} 
          className={ expanded ? ''  : 'sidenav-compact' }
          defaultOpenKeys={[]}
          activeKey={this.state.activeKey}
          onSelect={this.handleSelect}
        >
          <Sidenav.Body>
            <Navbar.Body>
              <Nav onSelect={this.props.onSelect} activeKey={this.props.activeKey}>
                <Nav.Item onClick={this.handleExpandSide}
                  eventKey="1" 
                  style={{height: 56}}
                  icon={<Icon icon="bars" size='lg' />}
                  componentClass='span'>
                  <Link to={'/'}></Link>
                </Nav.Item>
                <Dropdown title="Altro" eventKey='a'>
                  <Dropdown.Item eventKey="4">
                    <a href='/company/'>Company</a>
                  </Dropdown.Item>
                  <Dropdown.Item eventKey="5"><Link to={'/'}>Team</Link></Dropdown.Item>
                  <Dropdown.Item eventKey="6"><Link to={'/'}>Contact</Link></Dropdown.Item>
                </Dropdown>
                <Divider/>
              </Nav>
            </Navbar.Body>
          </Sidenav.Body>
        </Sidenav>
      )
    }
    else
      return (
        <Navbar {...this.props} className='main-nav'>
          <Navbar.Header>
            <a href="/" className="navbar-brand logo">
              LOGO
            </a>
          </Navbar.Header>
          <Navbar.Body>
            <Nav onSelect={this.props.onSelect} activeKey={this.props.activeKey}>
              <Nav.Item 
                eventKey="1"
                componentClass='span' icon={<Icon icon="home" />}>
                <Link to={'/'}>Home</Link>
              </Nav.Item>

              {DropdownCategory('Treasure Island', posts)}
              
              {/*
              <Dropdown title="Altro">
                <Dropdown.Item eventKey="4">
                  <a href='/company/'>Company</a>
                </Dropdown.Item>
                <Dropdown.Item eventKey="5">Team</Dropdown.Item>
                <Dropdown.Item eventKey="6">Contact</Dropdown.Item>
              </Dropdown>
            */}
            </Nav>
          </Navbar.Body>
        </Navbar>
      );
  }

};

function getPost(posts, cap, lang) {
  let p = null;
  _.forEach(posts, post => {
    if( 
      _.find(post.tags, tag => tag.name === lang) && 
      _.find(post.tags, tag => tag.name === cap)) {
      p = post;
    }
  })
  return p;
}

const DropdownCategory = (title, posts) => {

  if(_.isEmpty(posts)) return null;

  let list = [];
  let descriptionList = []
  _.forEach(posts, (post, key) => {
    if( _.find(post.tags, tag => tag.name === 'eng') ) {
      const cap = _.find(post.tags, tag => tag.name.split('-')[0] === 'chapter' )
      const engPost = post;
      const itaPost = getPost(posts, cap.name, 'ita');
      //list[cap.name] = {'eng': engPost, 'ita': itaPost }
      const subCategoryName = post.sub_category.name;
      if(list[subCategoryName] === undefined) {
        list[subCategoryName] = [];
        descriptionList[subCategoryName] = []
      }
      list[subCategoryName].push(
        <Dropdown.Item key={key}><div style={{display:'flex'}}>
          <Link to={"/reader/"+engPost.ID+'/'+itaPost.ID}>{_.capitalize(cap.name.split('-')[0]) + ' ' + cap.name.split('-')[1]}</Link> <divider />
          <Link to={"/editor/"+engPost.ID}>EDIT</Link></div>
        </Dropdown.Item>
      )
      descriptionList[subCategoryName] = post.sub_category.description;
    }

  })

  let parts = [];
  for(let partName in list) {
    parts.push(
      <Dropdown.Menu key={partName} title={partName + ' - '  + descriptionList[partName]}>
        {list[partName]}
      </Dropdown.Menu>
    )
  }
  return (
    <Dropdown title={title}>
      {parts}
    </Dropdown>
  )
}

const mapStateToProps = (state) => {
  return { posts: state.category.posts }
}

const mapDispatchToProps = dispatch => {
  return Object.assign({ dispatch })
}

export default connect(mapStateToProps, mapDispatchToProps)(Navigation)


function debounce(fn, ms) {
  let timer
  return _ => {
    clearTimeout(timer)
    timer = setTimeout(_ => {
      timer = null
      fn.apply(this, arguments)
    }, ms)
  };
}
