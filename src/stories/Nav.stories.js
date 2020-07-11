import React from 'react';
import {Navigation} from '../components/Nav';
import '../main.style';

export default {
  title: 'Navigation',
  component: Navigation
}

// Senza div l'addon per il responsive non va
const NavWrap = (props) => <div><Navigation {...props} /></div>

export const Default = () => NavWrap()

export const Inverted = () => NavWrap({appearance: 'inverse'})