import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchMeaning, fetchTraduction } from './actions';
import { getMeaning, getTraduction, fetchingMeaning, fetchingTraduction } from './reducer';
import { Notification, Drawer, Loader, List, Divider } from 'rsuite';
import _ from 'lodash';

import './style.css';

class Dictionary extends Component {

  constructor(props){
    super(props);
    this.state = {};
  }

  close(){
    this.props.close() // call parent hook for close drawer
  }

  componentDidUpdate(prevProps, prevState){
    if (prevProps.show === false && this.props.show) {
      const { word, dispatch } = this.props;
      fetchMeaning({word})(dispatch);
      fetchTraduction({word})(dispatch);
    }
  }

  render(){

    const { meaning, traduction } = this.props;
    return (
      <Drawer
        show={this.props.show}
        onHide={this.close.bind(this)}
      >
        <Drawer.Header>
          <Drawer.Title><b>Word: {this.props.word}</b></Drawer.Title>
        </Drawer.Header>
          <Drawer.Body>
            { this.props.fetchingMeaning 
              ? 
              <Loader size='md' content='Loading definitions and sounds'></Loader> 
              : 
              <div>
                <Divider><b>Definitions list</b></Divider>
                <DefinitionList def={meaning.def}/>
                <Divider><b>Sounds</b></Divider>
                <AudioWord lang='English' src={meaning.uk}/>
                <AudioWord lang='United States' src={meaning.us}/>
              </div>
            }
            { this.props.fetchingTraduction 
              ?
              <Loader size='md' content='Loading Traduction'></Loader> 
              :
              <div>
                <Divider><b>Traduction</b></Divider>
                <List hover id='traductions'>
                  {_.map(traduction, (ele, i) => <List.Item>{i+1}. {ele}</List.Item>)}
                </List>
              </div>
            }
          </Drawer.Body>
        }
        <Drawer.Footer>
        </Drawer.Footer>
      </Drawer>
    )

  }
}

function DefinitionList(props) {
  let list = [];

  let index = 1;
  _.forEach(props.def, (def, i) => 
    list.push(<List.Item key={i}>{(index++) + '. ' + def.replace(':','')}.</List.Item>)
  );
  return <List id='definitions-list' hover>{list}</List>
}

function AudioWord(props){

  if (!_.isEmpty(props.src)) {
    return (
      <div>{props.lang}
        <audio controls style={{width:'100%'}}>
          <source src={props.src} type="audio/mpeg"></source>
        </audio>
      </div>
    )
  }
  else return null;
}

const mapStateToProps = (state) => {
  return {
    meaning: getMeaning(state.dictionary),
    fetchingMeaning: fetchingMeaning(state.dictionary),
    fetchingTraduction: fetchingTraduction(state.dictionary),
    traduction: getTraduction(state.dictionary),
  }
}

const mapDispatchToProps = (dispatch) => {
  return Object.assign({}, {dispatch});
}

export default connect(mapStateToProps, mapDispatchToProps)(Dictionary);