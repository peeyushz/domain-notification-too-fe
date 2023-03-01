import { useState, useEffect , useContext} from 'react';
import axios from 'axios';
import './App.css';
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from "react-router-dom";
import Layout from './components/Landing/Index'
import Login from './components/Login/Index'
import Register from './components/Register/Index'
import Verification from './components/Register/Verification'
import ForgotPassword from './components/ForgotPassword/Index'
import ResetPassword from './components/ForgotPassword/ResetPassword'
import DomainList from './components/Dashboard/DomainList/Index'
import DomainTab from './components/Dashboard/DomainTab/Index'
import Profile from './components/Dashboard/Profile/Index'
import PaymentSuccessful from "./components/Dashboard/DomainTab/PaymentSuccessful"
import PaymentFailed from "./components/Dashboard/DomainTab/PaymentFailed"
import FeaturesSection from './components/Landing/FeaturesSection/Index'
// import PricingSection from './components/Landing/PricingSection/Index'
import InviteSection from './components/Landing/InviteSection/Index'
import UserDetailsContextProvider, {ChangeUserDetailsContext, UserDetailsContext} from './context/UserDetails';
import { baseUrl } from './details';
import Cookies from "universal-cookie";
import { ToastContainer } from 'react-toastify';
import BannerSection from './components/Landing/BannerSection/Index'
// import BannerForm from './components/Landing/BannerForm/Index'
import AddDomain from "./components/Dashboard/DomainList/AddDomain"

function RequireAuth({ children, redirectTo }) {
  const cookies = new Cookies();
  const navigate = useNavigate();
  const [isVerified, setIsVerified] = useState(null);
  const userDetails = useContext(UserDetailsContext);
  const changeUserDetails = useContext(ChangeUserDetailsContext);
  
  const setUserData = (jwt_token)=>{
    const promise = new Promise((resolve, reject) => {
      const config = {
        method: 'get',
        url: `${baseUrl}/api/get-user-data`,
        headers: { 
          'token': jwt_token,
          'Content-Type': 'application/json'
        }
      };
      
      axios(config)
      .then(function (response) {
        if(response.data.success){
          changeUserDetails(response.data.data.name, response.data.data.email, response.data.data.phoneNo, response.data.data.whatsappNo, response.data.data.countryCode, response.data.data.password, response.data.data.isEmailVerified);
          resolve("User Details Updated");
        }
        else{
          reject("Unable to Fetch User Details");
        }
      })
      .catch(function (error) {
        console.log(error);
        reject(error);
      });
    
    });
    return promise;
  }

  useEffect(()=>{
    let jwt_token =cookies.get("token")
    if(jwt_token!==undefined){
      const config = {
        method: 'get',
        url: `${baseUrl}/api/verify-jwt`,
        headers: { 
          'token': jwt_token,
          'Access-Control-Allow-Origin' : '*'
        }
      };
      axios(config)
      .then(function (response) {
        if(response.data.success){
          setIsVerified(true);
          setUserData(jwt_token)
          .then(()=>{
            setIsVerified(true);
          })
          .catch(()=>{
            setIsVerified(false);
          })
        }
        else{
          setIsVerified(false);
          changeUserDetails(" ", " ", " ", " ", " ", " ", " ");
        }
      })
      .catch(function (error) {
        console.log(error);
      });   
    }
    else{
      setIsVerified(false);
    }
     
  },[]);
  
  if(isVerified){
    return children
  }
  else if(isVerified===false){
    if(redirectTo===undefined){
      return children
    }
    else{
      return navigate(redirectTo);
    }
  }
  else{
    return (<div style={{height:"100vh",width:"100%",textAlign:"center",color:"#fff", background:"#000"}}></div>)
  }
}

function App() {
  return (
    <div className="App">
      <ToastContainer/>
        <BrowserRouter>
          <UserDetailsContextProvider>
            <Routes>
              <Route path="/" element={<Layout/>} >
                <Route path="/" element={<Navigate replace to="/home" />} />
                <Route path="/home"
                  element={<>
                    <RequireAuth>
                      <BannerSection/>
                      <section className="formsec" >
                        <div className="container">
                          <AddDomain/>
                        </div>
                      </section>
                    </RequireAuth>
                  </>}
                />
                <Route path="/features"
                    element={<FeaturesSection />}
                />
                <Route path="/pricing"
                    element={
                      <RequireAuth redirectTo={"/sign-in"}>
                        <DomainTab />
                      </RequireAuth>
                    }
                />
                <Route path="/invite"
                    element={<InviteSection />}
                 />
                <Route path="/domain-list"
                  element={
                    <RequireAuth redirectTo={"/sign-in"}>
                      <DomainList />
                    </RequireAuth>
                  }
                />
                <Route path="/domain-pay"
                  element={<Navigate replace to="/pricing"/>}
                />
                <Route path="/profile"
                  element={
                    <RequireAuth redirectTo={"/sign-in"}>
                      <Profile />
                    </RequireAuth>
                  }
                />
              </Route>
              <Route path="/sign-in"
                element={<Login/>}
              />
              <Route path="/sign-up"
                element={<Register/>}
              />
              <Route path="/forgot-password"
                element={<ForgotPassword />}
              />
              <Route path="/resetPassword"
                element={<ResetPassword />}
              />
              <Route path="/verification"
                element={<Verification />}
              />
              <Route path="/payment-successful"
                element={<PaymentSuccessful />}
              />
              <Route path="/payment-failed"
                element={<PaymentFailed />}
              />
            </Routes>
          </UserDetailsContextProvider>
        </BrowserRouter>
    </div>
  );
}

export default App;
