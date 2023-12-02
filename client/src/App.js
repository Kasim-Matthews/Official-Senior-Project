import navbar from "./components/navbar";
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import purchase from "./pages/purchase";

function App() {
  return (
  <div className="App">
    <Router>
      <navbar />
      <Switch>
        <Route path="/" exact component={purchase} />
      </Switch>
    </Router>
  </div>);
}

export default App;
