import React from 'react';
import { Dropdown, Icon } from 'rsuite'
import { Link } from 'react-router-dom'
import _ from 'lodash';

export default (categories, eventKey) => {
  return new DropdownCategories(categories, eventKey)
}

/**
  * Nota: il componente è cosi costruito per ritornare direttamente
  * Al livello del Nav il componente Dropdown. Se non fosse cosi composto
  * non funzionerebbe.
  */
class DropdownCategories {

  constructor(categories, eventKey='0'){
    this.ids = []
    this.eventKey = eventKey;
    /*
    this.list = [
      {id:1, name:'musica', parent: 0},
      {id:2, name:'vestiti', parent: 0},
      {id:3, name:'album', parent: 1},
      {id:4, name:'singolo', parent:1},
      {id:5, name:'maglie', parent:2},
      {id:6, name:'frutta', parent:0},
      {id:7, name:'susine', parent:6},
      {id:8, name:'blues', parent:3}
    ]
    */
    this.dropdowns = []
    this.list = categories;
    return this.render();
  }

  render(){    
    return (
      <Dropdown title='Categorie' eventKey={'cat-' + this.eventKey} 
        icon={<Icon icon='project'/>}
      >
        { _.size(this.list) > 0 ? this.makeDropdowns(this.list) : null }
      </Dropdown>
    )
  }

  makeDropdowns(list){
    
    let items = []

    for(const i in list) {
      let item = list[i]

      if( this.ids.indexOf(item.id) > -1 ) continue
      else this.ids.push(item.id)
      
      if(this.haveChilds(item.id)){
        let childs = []
        this.getChilds(item.id, childs)
        
        // drowdown-item è utile per uniformare in dimensione agli
        // altri items
        items.push(
          <Dropdown.Menu title={item.name} eventKey={'sub-'+item.name}className='dropdown-item'> 
            {this.makeDropdowns(childs)}
          </Dropdown.Menu>
        )
      }
      else{
        items.push( 
          <Dropdown.Item eventKey={String(this.eventKey++)} componentClass='span'>
            <Link to={'/category/'+item.id}>{item.name}</Link>
          </Dropdown.Item>)
      }
    }
    return items
  }
               
  haveChilds(parentId){
    return this.list.find( i => i.parent === parentId )
  }

  getChilds(parentId, childs = []){
    this.list.forEach( (item, i) => {
      if( item.parent === parentId ) {
        childs.push(item)
        this.getChilds(item.id, childs)
      }
    })
  }
}

