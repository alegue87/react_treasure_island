import React from 'react';
import { connect } from 'react-redux';
import { fetchPost, fetchReferences } from './actions';
import { getPosts, getReferences, isFetching } from './reducer';
import { Panel, FlexboxGrid, Col, Button, Sidenav, Notification } from 'rsuite';
import _ from 'lodash';
import { Howl, Howler } from 'howler';
import Dictionary from '../../components/Dictionary';
//import $ from 'jquery';
import { StickyContainer, Sticky } from 'react-sticky';

import './style.css';

class Selectors extends React.Component {

  constructor(props){
    super(props);
  }

  render(){
    const { data, counter } = this.props;
    let subCounter = 0;
    return _.map(data.split(' '), data => {
      subCounter++;
      let id = counter + '-' + subCounter;
      let classes = 'piece';
      return( 
        <span 
          key={subCounter}
          id={id} 
          onClick={this.props.handleSelect} 
          className={classes} 
          dangerouslySetInnerHTML={{__html: '&nbsp;'+data}}/>
        )
    })
  }
}

class Reader extends React.Component {

  constructor(props){
    super(props);
    const postIta = props.match.params.postIta;
    const postEng = props.match.params.postEng;

    this.state = {
      selected: '',          // without post_id   'N-N'
      selectedReference: '', // with post_id    'N-N-N'
      selectedPiece:'',      // for word selection
      audioSelected: 0,
      action: '',
      stopPlay: false,
      postEng: postEng,
      postIta: postIta,
      wordSelected: '',       // word for traduction
      showTraduction: false   // show Drawer traduction

    }
    this.oldSelected = this.state.selected;
    this.handleSelect = this.handleSelect.bind(this);
    this.play = this.play.bind(this);
    this.playAll = this.playAll.bind(this);
    this.playIndex = 0;
    this.hideTraduction = this.hideTraduction.bind(this);

    this.fetchData()
    Notification['info']({title:'construct'})
  }

  fetchData(){
    const { dispatch } = this.props;
    const { postIta, postEng } = this.state
    fetchPost({
      postId: postEng
    })(dispatch)
    fetchPost({
      postId: postIta
    })(dispatch)

    fetchReferences({
      postId: postEng
    })(dispatch)
  }

  componentDidMount(){
    //Notification['info']({title:'mounted'})
  }

  getSelectionId(reference){
    let split = reference.split('-');
    return `${split[1]}-${split[2]}`; // toglie post_id
  }

  insertReferencesIntoText(references){
    if(_.isUndefined(this.referencesInserted)){
      this.referencesInserted = true
    }
    else {
      return
    }

    _.forEach(references, item => {
      let id = this.getSelectionId(item.reference)
      document.getElementById(id).classList.add('selectable');
    })
    Notification['info']({title:'References inserted'})
  }

  alignText(){
    if(_.isUndefined(this.textAligned)){
      this.textAligned = true
    }
    else {
      return
    }

    const itaP = document.querySelectorAll('#ita p');
    _.forEach(document.querySelectorAll('#eng p'), ( val, key ) => {
      if(!_.isUndefined(itaP[key])) {
        itaP[key].style.position = 'absolute';
        itaP[key].style.top = val.offsetTop+'px';
      }
    })

    Notification['info']({title:'Text ready!'})
  }

  getReferences(){
    const { referencesList } = this.props;
    return _.sortBy(referencesList[this.state.postEng], ['name']); // sort necessario dato che alcune
                                                                   // volte l'ordine tra gli audio attribuiti
                                                                   // non è crescente.
  }

  componentDidUpdate(prevProps, prevState){

    const references = this.getReferences()
    //this.oldSelected = this.state.selected;
    if( !_.isEmpty(references) && !tooEarly(1000) ) {
      _.delay(this.insertReferencesIntoText.bind(this), 1500, references)
      _.delay(this.alignText.bind(this), 1500)
    }
  }

  updateSelection(current){
    if(this.state.selected !== '') {
      document.getElementById(this.state.selected).classList.remove('selected');
    }
    current.classList.add('selected');
  }

  onlyWord(word){
    word = word.replace(/&nbsp;/g, '')
    return word.replace(/[".,\/#!?$%\^&\*;:{}=\-_`~()“”]/g,"") // '
  }

  handleSelect(e){
    let current = e.currentTarget;
    this.selectedPiece = current.id;

    if(current.classList.contains('selectable')) {
      this.updateSelection(current);
      const reference = `${this.state.postEng}-${current.id}`;
      this.setState({
        selected: current.id, 
        selectedReference: reference
      });
    }
    const word = this.onlyWord(current.innerHTML);
    Notification['info']({'placement':'topStart', title: 'Word selected', description:word});
    this.setState({
      wordSelected: word
    });
  }

  play(index=0, onEnd=null) {
    const { selected, selectedReference } = this.state;
    const references = this.getReferences()

    if(_.isEmpty(selectedReference)) {
      Notification['info']({'placement': 'topStart', title:'Need selection first'});
      return
    }

    let ref = null;
    if( index === 0 ) {
      ref = _.find( references, ( item ) => item.reference === selectedReference );
    }
    else {
      this.playIndex = index;
      ref = references[index];
      const selectionId = this.getSelectionId(ref.reference)
      this.updateSelection(document.getElementById(selectionId))
      this.setState({
        selectedReference: ref.reference,
        selected: selectionId
      });      
    }

    let audio = new Howl({
      src:ref.source,
      autoplay: true,
      preload: true
    })

    audio.on('end', onEnd);
  }

  playAll() {
    this.setState({stopPlay: false});

    let index = 0;
    const handleEnd = () => {      
      const { selectedReference, stopPlay } = this.state;
      const references = this.getReferences()

      if( stopPlay ) {
        return
      }

      if( index === 0) {
        index = _.findIndex( references, (item) =>  item.reference === selectedReference)
      }

      // Skip duplicati
      // Da evitare in fase di inserimento: TODO
      while(
        !_.isUndefined(references[index+1]) && 
        references[index+1].name == references[index].name) {
        
        ++index;
        if(_.isUndefined(references[index+1])) break;
      }
      
      if( !_.isUndefined(references[index+1])) {
        this.play(++index, handleEnd)
      }
      else {
        Notification['info']({title: 'End of Chapter'})
      }
    }

    this.play(0, handleEnd.bind(this));
  }

  trigger(action){
    this.setState({action: action})
    setTimeout(()=> this.setState({action: '' }), 100)
  }


  hideTraduction(){
    this.setState({showTraduction: false})
  }

  render(){

    const postEng = this.props.posts.find( post => post.id === Number(this.state.postEng) )
    const postIta = this.props.posts.find( post => post.id === Number(this.state.postIta) )

    const { selected, action } = this.state;

    if(!_.isNil(postEng) && !_.isNil(postIta)) {
      Notification['info']({title:'render'})
      let engContent = null;
      let content = postEng.content.rendered.split('<p>')
      content = _.filter(content, data => !_.isEmpty(_.replace(data, /\n/, '')) )
      content = _.map( content, data => _.replace(data, '</p>', ''))
      let counter = 0;
      content = _.map(content, data => {
        counter++;
        return <p key={counter}><Selectors selected={selected} counter={counter} handleSelect={this.handleSelect} data={data}/></p>
      })

      let itaContent = postIta.content.rendered;

      return (
        <StickyContainer>
        <FlexboxGrid>
          <FlexboxGrid.Item  componentClass={Col} xs={24} sm={24} lg={24} xl={24}>
            <Sticky>
              { ({style}) => 
              <Panel className='player' style={style}>
                <Button onClick={ () => this.play() }>Play</Button>
                <Button onClick={ this.playAll }>Play All</Button>
                <Button onClick={ () => this.setState({stopPlay: true}) }>Stop</Button>
                <Button onClick={ () => this.setState({showTraduction:true}) }>Show word definitions</Button>

                {/*<Button onClick={ () => this.trigger('insert') }>Insert</Button>*/}
              </Panel>
              }
            </Sticky>
          </FlexboxGrid.Item>
          <FlexboxGrid.Item id='eng' className='text-container eng' componentClass={Col} xs={12} sm={12} lg={12} xl={12}>
            <h2 dangerouslySetInnerHTML={{__html: postEng.title.rendered}}></h2>
            <Panel>
              {content}
            </Panel>
          </FlexboxGrid.Item>
          <FlexboxGrid.Item id='ita' className='text-container ita' componentClass={Col} xs={12} sm={12} lg={12} xl={12}>
            <h2 dangerouslySetInnerHTML={{__html: postIta.title.rendered}}></h2>
            <Panel>
              <div dangerouslySetInnerHTML={{__html: itaContent}}/>
            </Panel>
          </FlexboxGrid.Item>
          <Dictionary
            word={this.state.wordSelected}
            show={this.state.showTraduction}
            close={ this.hideTraduction }
          />
        </FlexboxGrid>
        </StickyContainer>
      )
    }
    else {
      return <div></div>;
    }
  }

}

class Audio extends React.Component {
  render(){
    const { itemId, source } = this.props;
    return (
      <audio controls id={itemId}>
        <source src={source} type="audio/mpeg"></source>
      </audio>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return Object.assign({}, {dispatch})
}

const mapStateToProps = (state) => {
  return {
    posts: getPosts(state.reader),
    referencesList: getReferences(state.reader),
    fetching: isFetching(state.reader)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Reader);


/* for debounce */
let lastcall;
function tooEarly(ms=100){
    lastcall = lastcall || Date.now();
    const now = Date.now();
    if(lastcall < now-ms ) {
      lastcall = now;
      return true
    }
    else { 
      return false
    }
  }