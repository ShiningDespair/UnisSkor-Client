import './App.css';
import Header from './View/Components/Header';
import Footer from './View/Components/Footer';
import RegistirationPage from './View/Pages/RegistirationPage';
import MainPage from './View/Pages/MainPage';
import UniversityPage from './View/Pages/UniversityPage';
import AccountPage from './View/Pages/AccuntPage';
import PageNotFound from './View/Pages/PageNotFound'
import VerificationPage from './View/Pages/VerificationPage';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { AuthContext } from './Helpers/AuthContext';
import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // Burada doğru şekilde import ediyoruz

function App() {
  const [authState, setAuthState] = useState({id:0,status:false});


  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000; // Unix zamanı saniye cinsinden

      if (decodedToken.exp < currentTime) {
        // Token süresi dolmuş, token'ı kaldır
        localStorage.removeItem("accessToken");
        setAuthState({ status: false });
      } else {
        // Token süresi dolmamış, authState'i güncelle
        setAuthState({ id: decodedToken.stu_id, status: true });

        // Token süresi dolduğunda çalışacak bir zamanlayıcı ayarla
        const remainingTime = (decodedToken.exp - currentTime) * 1000;
        setTimeout(() => {
          localStorage.removeItem("accessToken");
          setAuthState({ status: false });
        }, remainingTime);
      }
    }
  }, []);

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      setAuthState({status:true});
    } else {
      setAuthState({status:false});
    }
  }, []);

  return (
    <AuthContext.Provider value={{ authState, setAuthState }}>
      <Router>
        <div className="App">
          <header className="App-header">
            <Header />
          </header>

          <div className="body-content">
            <Switch>
              <Route exact path='/'>
                <MainPage />
              </Route>
              <Route path='/Registiration'>
                <RegistirationPage />
              </Route>
              <Route path='/UniversityPage/:id'>
                <UniversityPage />
              </Route>
              <Route path='/AccountPage'>
                <AccountPage />
              </Route>
              <Route path='/Verify'>
                <VerificationPage />
              </Route>
              <Route>
                <PageNotFound/>
              </Route>
            </Switch>
          </div>

          <footer>
            <Footer />
          </footer>
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
