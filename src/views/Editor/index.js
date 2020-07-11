import React from 'react';
import { connect } from 'react-redux';
import { fetchPost } from './actions';
import { getPosts } from './reducer';
import { Panel, FlexboxGrid, Col, Button, Sidenav, Notification, Toggle } from 'rsuite';
import _ from 'lodash';
import AudioList from '../../components/Audio';
//import $ from 'jquery';

import './style.css';

class Selectors extends React.Component {

  constructor(props){
    super(props);
  }

  render(){
    const { selected, data, counter } = this.props;
    let subCounter = 0;
    return _.map(data.split(' '), data => {
      subCounter++;
      let id = counter + '-' + subCounter;
      let classes = 'piece';
      if(id === selected){
        classes = 'piece selected';
      }
      return( 
        <span 
          id={id} 
          onClick={this.props.handleSelect} 
          className={classes} 
          dangerouslySetInnerHTML={{__html: '&nbsp;'+data}}/>
        )
    })
  }
}

class Editor extends React.Component {

  constructor(props){
    super(props);
    this.postId = this.props.match.params.post

    this.state = {
      selected: 0,
      audioSelected: 0,
      action: '',
      canAttach:false,
      allAudio:false,
    }
    this.oldSelected = this.state.selected;
    this.handleSelect = this.handleSelect.bind(this);
    this.handleSelectAudio = this.handleSelectAudio.bind(this);
  }

  componentDidMount(){
    const { dispatch } = this.props
    fetchPost({
      postId: this.postId
    })(dispatch)
  }

  refresh(){
    this.componentDidMount()
    this.trigger('refresh-audio-list')
    this.setState({})
  }

  componentDidUpdate(){
    this.oldSelected = this.state.selected;
  }

  handleSelect(e){
    this.setState({selected: e.currentTarget.id});
  }

  handleSelectAudio(selected){
    // remove post_id from selection
    const split = selected.split('-');
    selected = `${split[1]}-${split[2]}`
    this.oldSelected = selected; // evita avanzamento
    this.setState({selected, action: ''})
  }

  selectionChanged(){
    return this.oldSelected !== this.state.selected
  }

  insertNextNplay(){
    if(this.state.canAttach === false) {
      Notification['info']({title: 'Abilitare inserimento'})
      return
    }
    this.trigger('insert');
    _.delay( this.trigger.bind(this), 50, 'next');
    _.delay( this.trigger.bind(this), 200, 'play');
  }

  trigger(action){
    this.setState({action: action})
    setTimeout(()=> this.setState({action: '' }), 100)
  }

  render(){

    let post = this.props.posts.find( post => post.id === Number(this.postId) )
    const { selected, action } = this.state;
    if(!_.isNil(post)) {
      let content = post.content.rendered.split('<p>')
      content = _.filter(content, data => !_.isEmpty(_.replace(data, /\n/, '')) )
      content = _.map( content, data => _.replace(data, '</p>', ''))
      let counter = 0;
      content = _.map(content, data => {
        counter++;
        return <p><Selectors selected={selected} counter={counter} handleSelect={this.handleSelect} data={data}/></p>
      })
      return (
        <FlexboxGrid>
          <Panel className='player-editor'>
            <Button onClick={ () => this.trigger('play') }>Play</Button>
            <Button onClick={ () => this.trigger('next') }>Next</Button>
            <Button onClick={ () => this.trigger('prev') }>Prev</Button>
            <Button onClick={ () => this.refresh() }>Reset audio</Button>
            <Button 
              color={this.state.canAttach ? 'green' : 'red'}
              onClick={ () => this.setState({canAttach:!this.state.canAttach}) }>
              Inserimento - {this.state.canAttach ? 'Attivo' : 'Disattivo'}
            </Button>
            <div style={{display:'flex', flexDirection:'column'}}>
              All audio files 
              <Toggle onChange={ () => { 
                this.setState({allAudio:!this.state.allAudio});
                this.refresh();
              }}/>
            </div>
          </Panel>
          <FlexboxGrid.Item className='text-container' componentClass={Col} xs={24} sm={24} lg={20} xl={22}>
            <Panel>
              {content}
            </Panel>
          </FlexboxGrid.Item>
          <FlexboxGrid.Item className={'fixed'} componentClass={Col} xs={24} sm={24} lg={4} xl={2}>
            <AudioList
              postId={this.postId}
              action={ this.selectionChanged() ? this.insertNextNplay() : action}
              selected={this.state.selected} 
              handleSelect={this.handleSelectAudio}
            />
              {/*showAlsoUnassigned={true || this.state.allAudio}*/}
          </FlexboxGrid.Item>
        </FlexboxGrid>
      )
    }
    else {
      return <div></div>;
    }
  }

}


const mapDispatchToProps = (dispatch) => {
  return Object.assign({}, {dispatch})
}

const mapStateToProps = (state) => {
  return {
    posts: getPosts(state.posts)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Editor);