import React, {useEffect, useState,useRef} from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../../details";
import { toast } from 'react-toastify';

const Index = () => {
  const emailRef = useRef(null);
  const [emailSent, setEmailSent] = useState(false); 
  const [emailSending, setEmailSending] = useState(false); 


  const handleReqLink = () =>{
    setEmailSending(true);
    const config = {
      method: 'get',
      url: `${baseUrl}/api/forget-password-initiate?email=${emailRef.current.value}`,
      headers: { }
    };
    axios(config)
    .then(function (response) {
      if(response.data.success){
        console.log(response.data)
        toast.success('E-Mail Sent', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000
        });
        setEmailSent(true);
        setEmailSending(false);
      }
      else{
        toast.error(response.data.msg, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000
        });
        setEmailSending(false);
      }
    })
    .catch(function (error) {
      console.log(error);
      setEmailSending(false);
    });
  }

  
  return (
    <>
      <div className="commonBg">
        <section className="bgImages">
          <div className="container-fluid">
            <div className="row  Average-chart mt-4 mb-5">
              <div className="col-md-12">
                <div className="headerpage">
                  <h2>Forgot Password</h2>
                  <Link to="/"><img className="logoimg11" src="images/logo.png" /></Link>
                </div>
                <div className="FormBOx">
                  <div style={emailSent?{display:"none"}:{}}>
                    <div className="text-center">
                      <p>We'll send you a confirmation email if the supplied email address matches the email linked to that account.</p>
                    </div>
                    <div>
                      <label>Email:</label>
                      <input ref={emailRef} type="email" />
                    </div>
                    <div className="btnsubmit text-center">
                      <button onClick={handleReqLink}>{emailSending?"Loading...":"Reset My Password"}</button>
                      <p>Don’t have an account? <Link to="/sign-up">Sign up here</Link></p>
                    </div>
                  </div>
                  <div style={emailSent?{}:{display:"none"}}>
                    <div className="text-center">
                      <p>An e-mail with password reset link has been sent to your registered e-mail address</p>
                    </div>
                    <div className="btnsubmit text-center">
                      <button onClick={handleReqLink}>Resend Link</button>
                    </div>
                  </div>
                </div>
                
                
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Index;
