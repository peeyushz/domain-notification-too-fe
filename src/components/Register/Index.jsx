import React, {useState, useRef} from "react";
import { Link, useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import axios from "axios";
import {baseUrl} from "../../details";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import parsePhoneNumber from 'libphonenumber-js';
import LoaderButton from "../common/LoaderButton";

const Index = () => {
  const formElement = useRef();
  const emailRef = useRef();
  const [phoneNo, setphoneNo] = useState("")
  const [countryCode, setcountryCode] = useState("91")
  const [errorMsg, setErrorMsg] = useState("")
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit  = event => {
    event.preventDefault();
    setErrorMsg("");
    setIsLoading(true);
    const formInputs = [...formElement.current.elements].filter(
        element => (element.type === "text" || element.type === "password" || element.type === "number")
    );
    const formData = {};
    formInputs.map(elem=>{
        formData[elem.name]=elem.value
    })
    formData["phoneNo"] = phoneNo.replace(countryCode,"");

    const validateResponse = validateFields(formData);

    if(validateResponse.isValid){
      formData["countryCode"] = "+"+countryCode;

      const config = {
        method: 'post',
        url: `${baseUrl}/api/register`,
        headers: {
          'Content-Type': 'application/json'
        },
        data : JSON.stringify(formData)
      };
      
      axios(config)
      .then(function (response) {
        if(response.data.success){
          setIsLoading(false);
          toast.success('Signed Up Successfully!', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2000
          });
          setTimeout(()=>{
            navigate('/sign-in');
          },2000)
        }
        else{
          setIsLoading(false);
          toast.error('Sign Up Failed! ' + response.data.msg, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2000
          });
        }
      })
      .catch(function (error) {
        setIsLoading(false);
        console.log(error);
      });
    }
    else{
      setIsLoading(false);
      setErrorMsg(validateResponse.msg)
    }  
  }

  const validateFields = (formData)=>{
    let isValid=true, msg;
    if(formData.name==="" || formData.email==="" || formData.password==="" || formData.rePassword==="" || formData.phoneNo==="" || formData.whatsappNo===""){
      isValid = false;
      msg="Please make sure all fields are filled"
    }
    else if(!(/^[a-zA-Z ]{3,30}$/.test(formData.name))){
      isValid = false;
      msg="Name should of 3 to 30 characters and cannot contain digits and special characters";
    }
    else if(!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(formData.email))){
      isValid = false;
      msg="Invalid Email";
    }
    else if(!(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(formData.password))){
      isValid = false;
      msg="Password should contain, minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character";
    }
    else if(formData.password!==formData.rePassword){
      isValid = false;
      msg="Password and Confirm Password do not match";
    }
    else if(!parsePhoneNumber("+"+countryCode+formData.phoneNo).isValid()){
      isValid = false;
      msg="Invalid Phone Number";
    }
    else if(!parsePhoneNumber("+"+countryCode+formData.whatsappNo).isValid()){
      isValid = false;
      msg="Invalid Whatspp Number";
    }
    return {"isValid":isValid, "msg":msg};
  }

  return (
    <>
      <section className="bgImages">
        <div className="container-fluid">
          <div className="row  Average-chart mt-4 mb-5">
            <div className="col-md-12">
              <div className="headerpage">
                  <h2>Sign Up</h2>
                  <img className="logoimg11" src="images/logo.png" alt=""/>
              </div>
              <div className="FormBOx">
                <div className="text-center">
                  <p style={{backgroundColor:"red", color:"white"}}>{errorMsg}</p>
                </div>
                <form ref={formElement}>
                  <div>
                      <label>Full Name:</label>
                      <input type="text" name="name" id="name" placeholder="Enter your Full Name" required={true}/>
                  </div>
                  <div>
                      <label>Email:</label>
                      <input type="text" ref={emailRef} name="email" id="email" placeholder="Enter email" required={true}/>
                  </div>
                  <div>
                      <label>Password:</label>
                      <input type="password" name="password" id="password" placeholder="Password" required={true} autoComplete={"on"}/>
                  </div>
                  <div>
                      <label>Confirm Password:</label>
                      <input type="password" name="rePassword" id="rePassword" placeholder="Confirm Password" required={true} autoComplete="on"/>
                  </div>
                  <div>
                    <label>Mobile No:</label>
                    <PhoneInput
                      country={"in"}
                      inputStyle={{
                        background: "#f3f5f6",
                        width: "100%",
                        height: "44px",
                        borderRadius: "9px",
                        marginTop: "5px",
                      }}
                      value={phoneNo}
                      onChange={(phone, e) => {
                        setcountryCode(e.dialCode);
                        setphoneNo(phone);
                      }}
                      // autoFormat={false}
                    />
                  </div>
                  <div>
                      <label>Whatsapp No:</label>
                      <input type="number" name="whatsappNo" required={true} />
                  </div>
                  <div className="btnsubmit text-center">
                    {isLoading?<LoaderButton/>:<button onClick={handleSubmit}>Sign Up</button>}
                    <p>Already have an account? <Link to="/sign-in">Login now</Link></p>
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
