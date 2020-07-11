import React from 'react';
import { connect } from 'react-redux';
import { fetchAudioList, setOrUpdateAudio, AUDIO_RESET } from './actions';
import { getAudioList, getReference, isSettingReference } from './reducer';
import { Panel, Notification } from 'rsuite';
import _ from 'lodash';
import './style.css';

class AudioList extends React.Component {

  constructor(props){
    super(props)

    this.list = []
    this.currentPlay = ''
    this.currentPlayIndex = this.firstIndex = 0
    this.lastActionTime = Date.now();
    this.reference = '';
    this.selectAudio = this.selectAudio.bind(this);
  }

  componentDidMount(){
    const { dispatch, postId } = this.props;
    fetchAudioList({postId})(dispatch);
  }

  componentDidUpdate(){
    if(!_.isEmpty(this.list)) {
      if(_.isEmpty(this.currentPlay)) {
        // first run
        this.currentPlayIndex = this.firstIndex = Number(Object.keys(this.list)[0])
        this.currentPlay = this.getAudioId(this.currentPlayIndex)
      }
    }
    const { reference, isSettingReference } = this.props
    if( !isSettingReference ) {

      if( this.reference !== '' ) {
        if( reference === this.reference ) {
          console.log('Update reference ok ' + reference)
        }
        else {
          console.log('error update reference: ' + this.reference + ' - ' + reference)
        }
        this.reference = '';
      }
    }
  }

  getAudioId(index){
    return 'audio-'+this.list[index].id
  }
  isPlaying(id){
    return 'audio-'+id === this.currentPlay;
  }
  isPlaylistEnded(){
    return this.list.length === this.currentPlayIndex+1
  }

  play(){
    if(!_.isEmpty(this.currentPlay)) {
      document.getElementById(this.currentPlay).play()  
    }
    else{
      alert('Playlist vuota!');
    }
  }

  getIdFromFilename(name){
    return Number(name.split('-')[1].split('.')[0]);
  }

  nextTrack(){
    if(!this.isPlaylistEnded()) {
      this.previousPlay = this.currentPlay;
      this.currentPlay = this.getAudioId(++this.currentPlayIndex);
    }
    else {
      alert('Playlist ended!')
    }    
  }

  prevTrack(){
    if( this.currentPlayIndex === this.firstIndex ) return
    this.currentPlay = this.getAudioId(--this.currentPlayIndex);
    //this.previousPlay = this.getAudioId(this.currentPlayIndex>this.firstIndex ? this.currentPlayIndex-1 : this.firstIndex)
  }

  switchAction(){
    // evita doppio click
    if((Date.now() - this.lastActionTime ) < 200){
      return
    }
    this.lastActionTime = Date.now();
    console.log('action: ' + this.props.action)
    switch(this.props.action) {
      case 'play':
        this.play();
        break;
      case 'prev':
        this.prevTrack();
        break;
      case 'next':
        this.nextTrack();
        break;
      case 'refresh-audio-list':
        Notification['info']({title:'refresh audio list'})
        const { dispatch, postId, showAlsoUnassigned } = this.props;
        dispatch({type: AUDIO_RESET})
        fetchAudioList({postId})(dispatch);
        break;
    }
  }

  selectAudio(item){
    const id = this.getIdFromFilename(item.name)
    this.currentPlayIndex = id;
    this.currentPlay = this.getAudioId(id);
    this.setState({refresh:''})
    this.props.handleSelect(item.reference)
  }

  render(){
    const { audioList, postId, selected, dispatch, isSettingReference } = this.props;
    let action = this.props.action;

    let componentList = null;
    if(!_.isEmpty(audioList)) {

      const list = _.filter(audioList, audio => audio.post_parent == postId || audio.post_parent == 0 )

      this.switchAction();

      let playingNameId = 0;
      _.forEach( list, (item) => { 
        // use the id in the filename for correct asc order
        const index = this.getIdFromFilename(item.name);

        if(this.isPlaying(item.id) ) {
          playingNameId = index
        } 

        if(action === 'insert' && this.isPlaying(item.id) ) {
          this.reference = `${postId}-${selected}`
          item = _.assign(item, { reference: this.reference })
          this.list[index] = item;

          if( !isSettingReference ){
            setOrUpdateAudio({
              id: item.id,
              reference: this.reference,
              post_parent: postId
            })(dispatch)
            action = '';
          }
        }
        else {
          if( _.isUndefined(this.list[index]) ) {
            this.list[index] = item;
          }
        }
      })

      componentList = this.list.map(item => {
        let fileNameId = this.getIdFromFilename(item.name);
        return <Audio 
          item={item}
          hide={ ( fileNameId < playingNameId-5 ) ? true : false }
          active={this.isPlaying(item.id)}
          handleClick={this.selectAudio}
        />
        }
      )
    }
    return (<Panel className='right-panel'>{componentList || null}</Panel>);
  }
}

class Audio extends React.Component {

  render(){
    const { item, active, hide } = this.props;
    return (
      <div 
        key={item.id}
        id={item.id}
        className={
          'audio-container ' + 
          ( active ? 'selected ' : '') +
          ( hide ? 'hidden' : '')
        }
        onClick={ () => {this.props.handleClick(item)} }
      >
        {item.name.split('.')[0]}
        { !_.isEmpty(item.reference) ? (' - ' + item.reference ) : '' }
        <audio controls id={'audio-'+item.id}>
          <source src={item.source} type="audio/mpeg"></source>
        </audio>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    audioList: getAudioList(state.audio),
    reference: getReference(state.audio),
    isSettingReference: isSettingReference(state.audio)
  }
}

const mapDispatchToProps = (dispatch) => {
  return Object.assign({}, {dispatch});
}

export default connect(mapStateToProps, mapDispatchToProps)(AudioList);