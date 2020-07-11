import React from 'react';

class Product extends React.Component {
	render(){
		return <div>Prodotto {this.props.productId}</div>;
	}
}