import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import StepRangeSlider from "react-step-range-slider";

const Index = () => {

    return (
        <>
            <section className="footersec">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="footerdiv">
                                <img src="images/logo-footer.png" />
                                <div className="menufooter">
                                    <ul>
                                        <li><a href="#">Home</a></li>
                                        <li><a href="#">Pricing</a></li>
                                        <li><a href="#">Features</a></li>
                                        <li><a href="#">Contact Us</a></li>
                                    </ul>
                                </div>
                                <div className="footericons">
                                    <ul>
                                        <li><a href="#"><img src="images/facebookmini.png" /></a></li>
                                        <li><a href="#"><img src="images/twittermini.png" /></a></li>
                                        <li><a href="#"><img src="images/inmini.png" /></a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="copyright">
                        <p>Copyright © 2023 DomainDing. All rights reserved.</p>
                </div>
            </section>
        </>
    );
};

export default Index;
