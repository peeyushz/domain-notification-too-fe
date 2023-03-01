import React, { useEffect, useState, useContext } from "react";
import { Link,  } from "react-router-dom";
import { UserDetailsContext } from "../../../context/UserDetails";

const Index = () => {
    const userDetails = useContext(UserDetailsContext);

    return (
        <>
            <div id="sec1"></div>
            <section className="bannerSection" >
                <div className="container">
                    <div className="row sec-alline pt-5 pb-4">
                        <div className="col-md-6">
                            <div className="head-text">
                                <h1>Domain Expiration Alerts</h1>
                                <p>Never Lose Your Domain Again!</p>
                                <Link className="main-bttn" to={userDetails.name===" "?"/sign-in":"/domain-list"}>Get Started Now!</Link>
                            </div>
                        </div>
                        <div className="col-md-6 head-img-sec">
                            <div>
                                <img className="img-fluid" src="images/head-img.png" alt="" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Index;
