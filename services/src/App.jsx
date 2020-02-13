//
// Copyright (c) 2019 Nutanix Inc. All rights reserved.
//
// The Minerva UI Sub-Application
//
import React from 'react';
import SearchWidget from './components/SearchWidget';
// Containers
import { ModalContainer } from './containers';

// App Level CSS
import './App.less';
import FileServerSettings from './components/FileServerSettings';
import ShareLevelPermissions from './components/ShareLevelPermissions';

class App extends React.Component {

  render() {
    // Finally all is good, show the main app
    return (
      <div className="file-server-app">
        <ModalContainer />
       
        <ShareLevelPermissions/>
       
      </div>
    );
  }

}

export default App;
