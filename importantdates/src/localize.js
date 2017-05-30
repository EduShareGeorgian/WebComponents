import React from 'react';
import { localize } from 'react-localize-redux';
 
const Greeting = ({ translate, currentLanguage }) => (
  <div>
    <h1>{ translate('greeting', { name: 'Ryan' }) }</h1>
    <p>The current language is { `${ currentLanguage }` }</p>
    <button>{ translate('farwell') }</button>
  </div>
);
 
// decorate your component with localize 
export default localize()(Greeting);