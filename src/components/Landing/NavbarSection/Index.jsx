import React, { useEffect, useState, useContext } from "react";
import { Link,NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import {baseUrl} from "../../../details";
import {UserDetailsContext, ChangeUserDetailsContext} from "../../../context/UserDetails";
import Cookies from "universal-cookie";
import { toast } from "react-toastify";

const Index = () => {
    const [scroll, setScroll] = useState(false);
    const userDetails = useContext(UserDetailsContext);
    const changeUserDetails = useContext(ChangeUserDetailsContext);
    const navigate = useNavigate();
    const cookies = new Cookies();
    const jwt_token = cookies.get("token");
    
    useEffect(() => {
        window.addEventListener("scroll", () => {
            setScroll(window.scrollY > 50);
        });

    }, []);


    const logout = ()=>{
        const config = {
            method: 'get',
            url: `${baseUrl}/api/logout`,
            headers: {
              'token': jwt_token
            }
        };

        axios(config)
        .then(function (response) {
            if(response.data.success){
                changeUserDetails(" ", " ", " ", " ", " ", " ", true)
                navigate("/home")
            }
            else{
                toast.error("Unable to Logout!!", {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    autoClose: 2000
                });
            }
        })
        .catch(function (error) {
            console.log(error);
            toast.error("Unable to Logout!!", {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 2000
            });
        });
    }

    return (
        <>
            <section className={scroll ? "bannerSection1 fixedtop" : "bannerSection1 hidefixed"}  >
                <div className="borderbtm">
                    <div className="container ">
                        <nav className="navbar navbar-expand-lg navbar-light  p-0">
                            <Link to="/home"><img className="logoimg" src="images/logo.png" /></Link>
                            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
                                <span className="navbar-toggler-icon"></span>
                            </button>

                            <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
                                <ul className="navbar-nav m-auto ul-list">
                                    <li className="nav-item active">
                                        <NavLink className="nav-link" to="/home">Home <span className="sr-only">(current)</span></NavLink>
                                    </li>
                                    <li className="nav-item">
                                        <NavLink className="nav-link" to="/features">Features</NavLink>
                                    </li>
                                    <li className="nav-item">
                                        <NavLink className="nav-link" to="/pricing">Pricing</NavLink>
                                    </li>
                                    <li className="nav-item">
                                        <NavLink className="nav-link" to="/contact">Contact</NavLink>
                                    </li>
                                    <li className="nav-item">
                                        <NavLink className="nav-link" to="/invite">Invite Friends</NavLink>
                                    </li>
                                </ul>
                                {userDetails.name!==" "?(
                                <ul className="navbar-nav m-auto ul-list">
                                    <li className="nav-item dropdown">
                                        <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            {userDetails.name}
                                        </a>
                                        <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                                            <Link className="dropdown-item m-0" to="/domain-list" >Dashboard</Link>
                                            <Link className="dropdown-item m-0" to="/domain-pay" >Domain Checkout</Link>
                                            <div className="dropdown-divider"></div>
                                            <Link className="dropdown-item m-0" to="/profile">Update Profile</Link>
                                            <a className="dropdown-item m-0" onClick={()=>logout()} href="#">Logout</a>
                                        </div>
                                    </li>   
                                </ul>):
                                (<form className="form-inline my-2 my-lg-0 formbtn">
                                    <Link to="/sign-in" className="btn btn-outline-success my-2 my-sm-0">SIGN IN</Link>
                                    <Link to="/sign-up" className="btn btn-outline-success my-2 my-sm-0 onclass">SIGN UP</Link>
                                </form>)}
                            </div>
                        </nav>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Index;
