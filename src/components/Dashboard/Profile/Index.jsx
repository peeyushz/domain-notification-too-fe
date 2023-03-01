import React, { useEffect, useState, useRef, useContext } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import {UserDetailsContext, ChangeUserDetailsContext} from "../../../context/UserDetails";
import axios from "axios";
import {baseUrl} from "../../../details";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import parsePhoneNumber from 'libphonenumber-js'
import Cookies from "universal-cookie";

const Index = () => {
    const nameRef = useRef(null);
    const emailRef = useRef(null);
    const whatsappNoRef = useRef(null);
    const [phoneNo,setPhoneNo] = useState();
    const [countryCode,setCountryCode] = useState();
    const userDetails = useContext(UserDetailsContext);
    const changeUserDetails = useContext(ChangeUserDetailsContext);
    const [errorMsg, setErrorMsg] = useState(null);
    const cookies = new Cookies();
    const jwt_token = cookies.get("token")

    useEffect(()=>{
        nameRef.current.value = userDetails.name
        emailRef.current.value = userDetails.email
        whatsappNoRef.current.value = userDetails.whatsappNo
        setCountryCode(userDetails.countryCode.replace("+",""));
    },[userDetails])
    
    const validateFields = (formData)=>{
        let isValid=true, msg;

        if(formData.name!==undefined && !(/^[a-zA-Z ]{3,25}$/.test(formData.name))){
          isValid = false;
          msg="Name should of 3 to 25 characters and cannot contain digits";
        }
        else if(formData.phoneNo!==undefined && !parsePhoneNumber("+"+countryCode+formData.phoneNo).isValid()){
          isValid = false;
          msg="Invalid Phone Number";
        }
        else if(formData.whatsappNo!==undefined && !parsePhoneNumber("+"+countryCode+formData.whatsappNo).isValid()){
          isValid = false;
          msg="Invalid Whatspp Number";
        }
        return {"isValid":isValid, "msg":msg};
    }

    const handleUpdateProfile = ()=>{
        let phone = phoneNo;
        if(emailRef.current.value === userDetails.email){
            let data = {};
            if(nameRef.current.value !== userDetails.name){
                data["name"]=nameRef.current.value;
            }
            if(phone!==undefined && phone.replace(countryCode, "") != userDetails.phoneNo){
                console.log(phone.replace(countryCode, ""))
                data["phoneNo"] = Number(phone.replace(countryCode, ""));
            }
            if(whatsappNoRef.current.value != userDetails.whatsappNo){
                data["whatsappNo"] = whatsappNoRef.current.value
            }
            if(countryCode !== userDetails.countryCode.replace("+","")){
                data["coutryCode"] = "+"+countryCode;
            }
            const validatedFields = validateFields(data);

            if(validatedFields.isValid){
                console.log(data)
                const config = {
                    method: 'post',
                    url: `${baseUrl}/api/update-profile`,
                    headers: {
                        'token': jwt_token,
                        'Content-Type': 'application/json'
                    },
                    data : JSON.stringify(data)
                };
                axios(config)
                .then(function (response) {
                        if(response.data.success){
                            toast.success("Your details are updated", {
                                position: toast.POSITION.TOP_RIGHT,
                                autoClose: 2000
                            });
                            changeUserDetails(data.name?data.name:null, null, data.phoneNo?data.phoneNo:null, data.whatsappNo?data.whatsappNo:null, data.countryCode?data.countryCode:countryCode,null, null )
                    }
                    else{
                        toast.error(response.data.msg, {
                            position: toast.POSITION.TOP_RIGHT,
                            autoClose: 2000
                        });
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
            }
            else{
                setErrorMsg(validatedFields.msg)
            }
            
            
        }
    }

    return (
        <>
            <section className="domainlistSec" >
                <div className="container">
                    <div className="row ">
                        <div className="col-md-10 m-auto">
                            <div className="listofdomain">

                                <div className="row FormBOx" style={{ maxWidth: "800px", margin: "auto" }}>
                                    <div className="col-md-12">
                                        <div className="headings-domain">
                                            <h4>Your Profile</h4>
                                            <img src="images/logo.png" />
                                        </div>
                                        <div className="text-center">
                                            <p style={{backgroundColor:"red", color:"white"}}>{errorMsg}</p>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        
                                        <label>Full Name:</label>
                                        <input type="text" ref={nameRef}/>
                                    </div>
                                    <div className="col-md-6">
                                        <label>Email:</label>
                                        <input type="email" ref={emailRef} disabled/>
                                    </div>
                                    {/* <div className="col-md-6">
                                        <label>Password:</label>
                                        <input type="password" />
                                    </div>
                                    <div className="col-md-6">
                                        <label>Confirm Password:</label>
                                        <input type="password" />
                                    </div> */}
                                    <div className="col-md-6">
                                        <label>Mobile No:</label>
                                        <PhoneInput
                                            country={"in"}
                                            name="phoneNO"
                                            value={userDetails.countryCode.replace("+","")+userDetails.phoneNo}
                                            onChange={(phone, e) => {
                                                setCountryCode(e.dialCode);
                                                setPhoneNo(phone);
                                            }}
                                            inputStyle={{
                                                background: "#f3f5f6",
                                                width: "100%",
                                                height: "44px",
                                                borderRadius: "9px",
                                                marginTop: "5px",
                                            }}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label>Whatsapp No:</label>
                                        <input ref={whatsappNoRef} type="number" />
                                    </div>
                                    <div className="updatebuton">
                                        <button onClick={handleUpdateProfile}>Update Profile</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Index;
