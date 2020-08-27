import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './pages/home';
import Login from './pages/login';
import Signup from './pages/signup';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';

const theme = createMuiTheme({
    palette: {
        primary: {
            light: '#33c9dc',
            main: '#FF5722',
            dark: '#d50000',
            contrastText: '#fff'
        }
    }
});

function App() {
  return (
      <MuiThemeProvider theme={theme}>
          <Router>
              <div>
                  <Switch>
                      <Route exact path="/" component={Home}/>
                      <Route exact path="/login" component={Login}/>
                      <Route exact path="/signup" component={Signup}/>
                  </Switch>
              </div>
          </Router>
      </MuiThemeProvider>
  );
}

export default App;
