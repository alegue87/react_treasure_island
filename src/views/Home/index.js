import React from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { Panel, Divider, List, FlexboxGrid, Col } from 'rsuite';
import config from '../../config/config';
import _ from 'lodash';
import './style.css';

class Home extends React.Component{

  constructor(props){
    super(props)
    this.state = { posts: null }
  }

  render()
  {
    const { posts } = this.props;

    return(
      <FlexboxGrid>
        <FlexboxGrid.Item componentClass={Col} lg={4} xl={5}/>
        <FlexboxGrid.Item componentClass={Col} lg={16} xl={14}>
          <Panel>
            <div style={{textAlign:'center'}}>
              <h1>Treasure Island</h1>
              <h3>Martin Louis Stevenson</h3>
              <figure>
                <img
                  style={{height:'500px', borderRadius:'5px'}}
                  src='https://images.unsplash.com/photo-1564845654222-d437f029c5c4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1351&q=80'
                  alt='Alfonso Reyes - boat'
                />
                <figcaption>Image from unsplash by Alonso Reyes</figcaption>
              </figure>
              <hr/>
              <p>Audio-libro bilingue Inglese-Italiano con supporto dizionario (Oxford)</p>
              <p>Letto da: Mark F. Smith, audio completo su <a href='https://www.youtube.com/watch?v=PuiDkBO_SAY'>Youtube</a></p>
              <p>Traduzione da: <a href='https://libri.freenfo.net/3/3044030.html'>libri.freenfo.net</a></p>
              <p>Dev by: Alessio Guerriero</p>
            </div>
            <hr/>
            <h3>Utilizzo</h3>
              <div
                dangerouslySetInnerHTML={
                  {__html:'<iframe width="100%" height="600px" src="https://www.youtube.com/embed/UwHFogMirgU" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'}}
              />
            <hr/>
            <h3>Contents</h3>
            {DropdownCategory('Treasure Island', posts, config.isAdmin)}
          </Panel>
        </FlexboxGrid.Item>
      </FlexboxGrid>
    )
  }
}

const mapStateToProps = (state) => {
  return { posts: state.category.posts }
}

export default connect(mapStateToProps, null)(Home);


const DropdownCategory = (title, posts, isAdmin) => {

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
        <List.Item key={key}>
          <div style={{display:'flex'}}>
            <Link to={"/reader/"+engPost.ID+'/'+itaPost.ID}>
              {engPost.post_title} - {engPost.chapter} 
            </Link>
            { isAdmin ? <Link to={"/editor/"+engPost.ID}>EDIT</Link> : null }
          </div>
        </List.Item>
      )
      descriptionList[subCategoryName] = post.sub_category.description;
    }

  })

  let parts = [];
  for(let partName in list) {
    parts.push(
      <Panel header={partName + ' - ' + descriptionList[partName]}>
        <List key={partName}>
          {_.reverse(list[partName])}
        </List>
      </Panel>
    )
  }
  return (
    <div id='contents'>
      {_.reverse(parts)}
    </div>
  )
}

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