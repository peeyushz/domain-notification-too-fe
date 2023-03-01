import {useEffect, useRef, useState} from "react";
import { Link , useSearchParams, useNavigate} from "react-router-dom";
import { baseUrl } from "../../details";
import axios from "axios";
import { toast } from 'react-toastify';

const ResetPassword = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [isVerified, setIsVerified] = useState(null);
    const passwordRef = useRef(null);
    const rePasswordRef = useRef(null);
    const navigate = useNavigate();

    useEffect(()=>{
        if(searchParams.get("token")!==null && searchParams.get("key")!==null){
            const config = {
                method: 'get',
                url: `${baseUrl}/api/forget-password-verify-link?token=${searchParams.get("token")}&key=${searchParams.get("key")}`,
            };
            
            axios(config)
            .then(function (response) {
              if(response.data.success){
                setIsVerified(true);
              }
              else{
                setIsVerified(false);
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
            setIsVerified(false)
        }
    },[])

    const handlePassChange = ()=>{
        if(!(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(passwordRef.current.value))){
            toast.error("Password should contain, minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 2000
            });
        }
        else if(passwordRef.current.value!==rePasswordRef.current.value){
            toast.error("Password and Confirm Password do not match", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 2000
            });
        }
        else{
            var data = JSON.stringify({
                "key": searchParams.get("key"),
                "token": searchParams.get("token"),
                "password": passwordRef.current.value,
                "rePassword":  rePasswordRef.current.value
            });
            const config = {
                method: 'post',
                url: `${baseUrl}/api/forget-password`,
                headers: {
                    'Content-Type': 'application/json'
                },
                data : data
            };
            axios(config)
            .then(function (response) {
                if(response.data.success){
                    toast.success("Password Reset Successfully", {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 2000
                    });
                    setTimeout(()=>{
                        navigate("/sign-in")
                    },1000) 
                }
                else{
                    toast.error("Password Reset Unsuccessful", {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 2000
                    });
                }
            })
            .catch(function (error) {
                console.log(error);
                toast.error("Password Reset Unsuccessful", {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 2000
                });
            });
        }
        
    }
    
    return (
        <>
            <div className="commonBg">
                <section className="bgImages">
                    <div className="container-fluid">
                        <div className="row  Average-chart mt-4 mb-5">
                            <div className="col-md-12">
                                <div className="headerpage">
                                    <h2>Reset Password</h2>
                                    <Link to="/"><img className="logoimg11" src="images/logo.png" /></Link>
                                </div>
                                <div className="FormBOx">
                                    {isVerified===null?
                                    <div className="text-center">
                                        <p>Please wait, while we are verifying your link</p>
                                    </div>:
                                    isVerified?
                                    <div className="login-box main-box">
                                        <div className="login-logo">
                                            <div className="lable-innput ">
                                                <label className="mt-4" style={{ color: "#88898D" }}>New Password</label>
                                                <input type="password" ref={passwordRef} placeholder="Enter New Password" name="" />
                                                <label className="mt-4" style={{ color: "#88898D" }}>New Re-Password</label>
                                                <input type="password" ref={rePasswordRef} placeholder="Enter New Re-Password" name="" />
                                            </div>
                                            <div className="btnsubmit text-center mt-4">
                                                <button onClick={handlePassChange}>Reset Password</button>
                                            </div>
                                        </div>
                                    </div>:
                                    <div className="text-center">
                                        <p>Invalid Password Reset Link!!</p>
                                    </div>
                                    }
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default ResetPassword;
