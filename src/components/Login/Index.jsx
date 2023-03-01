import {useRef, useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import {baseUrl} from "../../details";
import axios from "axios";
import { toast } from 'react-toastify';
import LoaderButton from "../common/LoaderButton"
import Cookies from 'universal-cookie';

const Index = () => {
  const formElement = useRef();
  const navigate = useNavigate();
  const cookies = new Cookies();
  const [isLoading, setIsLoaading] = useState(false);

  const handleSubmit  = event => {
    event.preventDefault()
    const formInputs = [...formElement.current.elements].filter(
        element => (element.type === "email" || element.type === "password")
    );
    setIsLoaading(true);
    const formData = {};
    formInputs.map(elem=>{
        formData[elem.name]= elem.value
    })
    
    const config = {
      method: 'post',
      url: `${baseUrl}/api/login`,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin' : '*'
      },
      data : JSON.stringify(formData)
    };

    axios(config)
    .then(function (response) {
      if(response.data.success){
        toast.success('Login Successfully!', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000
        });
        cookies.set('token', response.data.data.jwtToken, { path: '/' });
        setTimeout(()=>{
          navigate("/home");
        },1000)
        
      }
      else{
        toast.error('Login Failed! ' + response.data.msg, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000
        });
        setIsLoaading(false);
      }
  
    })
    .catch(function (error) {
      console.log(error);
      setIsLoaading(false);
    });
  }

  return (
    <>
      <section className="bgImages">
        <div className="container-fluid">
          <div className="row  Average-chart mt-4 mb-5">
            <div className="col-md-12">
              <div className="headerpage">
                  <h2>Login</h2>
                  <img className="logoimg11" src="images/logo.png" alt=""/>
              </div>
              <div className="FormBOx">
                <form ref={formElement} onSubmit={handleSubmit}>
                  <div>
                      <label>Email:</label>
                      <input type="email" name="email" id="email" placeholder="Enter email" required={true}/>
                  </div>
                  <div>
                      <label>Password:</label>
                      <input type="password" name="password" id="password" placeholder="Password" required={true}/>
                  </div>
                  <div className="btnsubmit text-center">
                    {isLoading?<LoaderButton/>:<button>Login</button>}
                    <p>Don’t have an account? <Link to="/sign-up">Sign up here</Link></p>
                    <p>Forgot password? <Link to="/forgot-password">Click here</Link></p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Index;
