import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchMeaning, fetchTraduction } from './actions';
import { getMeaning, getTraduction } from './reducer';
import { Notification, Drawer, Loader } from 'rsuite';
import _ from 'lodash';

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
    }
  }

  render(){

    const { meaning } = this.props;
    return (
      <Drawer
        show={this.props.show}
        onHide={this.close.bind(this)}
      >
        <Drawer.Header>
          <Drawer.Title>Word: {this.props.word}</Drawer.Title>
        </Drawer.Header>
        {!_.isEmpty(meaning) 
          ? 
          <Drawer.Body>
            {_.map(meaning.def, def => <p>{def.replace(':','')}</p>)}
          </Drawer.Body>
          :
          <Loader size='medium'/>
        }
        <Drawer.Footer>
        </Drawer.Footer>
      </Drawer>
    )

  }
}

const mapStateToProps = (state) => {
  return {
    meaning: getMeaning(state.dictionary),
    engToIta: getTraduction(state.dictionary),
  }
}

const mapDispatchToProps = (dispatch) => {
  return Object.assign({}, {dispatch});
}

export default connect(mapStateToProps, mapDispatchToProps)(Dictionary);