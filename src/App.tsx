import React, {Component} from 'react';
import { Provider } from 'mobx-react';
import 'normalize.css/normalize.css';
import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
import '@blueprintjs/datetime/lib/css/blueprint-datetime.css';
import './App.css';
import EpicScreen from './views/EpicScreen';
import EpicStore from './stores/epic';


export class App extends Component {
  private epicStore = new EpicStore();
  render() {
    return (
      <Provider epicStore={this.epicStore}>
        <div className="app">
          <EpicScreen />
        </div>
      </Provider>
    )
  }
}

export default App;
