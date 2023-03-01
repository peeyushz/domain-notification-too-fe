import React, { useContext, useState, useRef } from "react";
import { baseUrl } from "../../../details";
import axios from "axios";
import { UserDetailsContext } from "../../../context/UserDetails";
import { toast } from 'react-toastify';
import AddDomain from "./AddDomain"
import DomainList from "./DomainList"
import Cookies from "universal-cookie";

const Index = () => {
    const userDetails = useContext(UserDetailsContext);
    const [isResending, setIsResending] = useState(false);
    const cookies = new Cookies();
    const jwt_token = cookies.get("token")
    const [reload, setReload]  = useState(true)

    const handlereload = (bool) => {
        setReload(bool)
    }

    const resendEmail = ()=>{
        setIsResending(true);
        const config = {
            method: 'get',
            url: `${baseUrl}/api/resend-email-verification`,
            headers: {
                'token': jwt_token
            }
        };
        axios(config)
        .then(function (response) {
            if(response.data.success){
                toast.success("E-Mail verification link sent to your registered mail id", {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 2000
                });
            }
            setIsResending(false);
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    return (
        <>
            <section className="domainlistSec" >
                <div className="container">
                    <div className="row">
                        <div className="col-md-10 m-auto">
                            <div className="listofdomain">
                                <div style={{backgroundColor:"yellow", color:"black"}} className="text-center">
                                    {userDetails.emailVerified?<></>:isResending?"Sending...":
                                    <><span>Your e-mail is not verified!</span>
                                    <a href="#" onClick={resendEmail}>{" Click Here "}</a>
                                    <span>to resend verification link</span></>}
                                </div>
                                <div className="headings-domain">
                                    <h4>Your Domains</h4>
                                    <img src="images/logo.png" />
                                </div>
                                <AddDomain handlereload={handlereload} />
                                <DomainList handlereload={handlereload} reload={reload} /> 
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Index;
