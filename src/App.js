import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import LoginPage from './pages/LoginPage';
import { Redirect, Route, Switch } from 'react-router-dom';
import HomePage from './pages/Home';
import { useContext } from 'react';
import AuthContext from './store/auth-context';
import { Container } from 'react-bootstrap';
import SchemaPage from './pages/SchemaPage';
import CollectionPage from './pages/CollectionPage';
import NotFoundPage from './pages/NotFoundPage';


function App() {

  const authCtx = useContext(AuthContext);

  return (
    <Container className='bg-light shadow'>
      <Switch>
        <Route path='/' exact>
          <LoginPage />
        </Route>
        <Route path='/home' exact>
          {authCtx.isLoggedIn && <HomePage />}
          {!authCtx.isLoggedIn && <Redirect to='/login' />}
        </Route>
        {
          authCtx.isLoggedIn && (
            <Route path='/schema/:schema'>
              <SchemaPage />
            </Route>
          )
        }
        {
          authCtx.isLoggedIn && (
            <Route path='/:schema/:collection'>
              <CollectionPage />
            </Route>
          )
        }
       {!authCtx.isLoggedIn && <Redirect to='/'></Redirect>}
       <Route to='/not-found'>
          <NotFoundPage />
       </Route>
      </Switch>
    </Container>
  );
}

export default App;
