import {useContext, useEffect, useRef, useState} from "react";
import { Link , useSearchParams} from "react-router-dom";
import { baseUrl } from "../../details";
import axios from "axios";
import {ChangeUserDetailsContext} from '../../context/UserDetails';

const Verification = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const changeUserDetails = useContext(ChangeUserDetailsContext)
    const [isVerified, setIsVerified] = useState(null)

    useEffect(()=>{
        if(searchParams.get("token")!==null && searchParams.get("key")!==null && isVerified===null){
            var data = JSON.stringify({
                "key": searchParams.get("key"),
                "token": searchParams.get("token")
            });

            const config = {
                method: 'post',
                url: `${baseUrl}/api/verify-link`,
                headers: {
                  'Content-Type': 'application/json'
                },
                data : data
            };
            axios(config)
            .then(function (response) {
                if(response.data.success){
                    console.log(JSON.stringify(response.data));
                    setIsVerified(true);
                    changeUserDetails(null, null, null, null, null, null, true);
                }
                else{
                    setIsVerified(false)
                    console.log(response.data.msg)
                }
            })
            .catch(function (error) {
                console.log(error);
            });
        }
    },[])

    return (
        <> 
            <div className="commonBg">
                <section className="bgImages">
                    <div className="container-fluid">
                        <div className="row  Average-chart mt-4 mb-5">
                            <div className="col-md-12">
                                <div className="headerpage">
                                    <h2>Verification</h2>
                                    <Link to="/"><img className="logoimg11" src="images/logo.png" /></Link>
                                </div>
                                <div className="FormBOx">
                                    <div className='container-fluid d-flex justify-content-center align-item-center' style={{ height: '275px', marginTop: "80px", alignItems: "center" }}>
                                        <div className="row">
                                            <div className="col-12 color-white text-center" style={{ padding: "" }} >
                                                <h1 className='' style={{ color: 'black' }}>
                                                    {isVerified===null?
                                                    <>Please wait, while we are verifying your email...</>:
                                                    isVerified===true?
                                                    <>Thank you for confirming. Please click <Link to='/sign-in' style={{ color: "green" }}>here</Link> to login.</>:
                                                    <>The Link is either invalid or has been expired</>
                                                    }
                                                </h1>
                                            </div>
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

export default Verification;
