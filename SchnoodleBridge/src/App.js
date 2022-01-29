import './App.css';
import MainPage from './components/MainPage';
import { Route, Switch } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import Error404 from './components/Error404';
import Information from './components/Information';

function App() {
  return (
    <BrowserRouter>
    <Switch>
    <Route path="/" component={MainPage} exact/>
    <Route path="/info" component={Information}/>
    <Route path="*" component={Error404}/>
    </Switch>
    </BrowserRouter>
  );
}

export default App;
