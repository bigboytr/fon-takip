import React from 'react';
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'

// comps
import Header from './components/Header'
import Portfolio from "./components/Portfolio";

library.add(fas);


function App() {
  return (
    <div className="container-fluid m-0 p-0">
      <Header/>
      <Portfolio/>
    </div>
  );
}

export default App;
