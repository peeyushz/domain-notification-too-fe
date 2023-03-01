import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import StepRangeSlider from "react-step-range-slider";

const Index = () => {

    return (
        <>
            <section className="inviteSec" >
                <div id="sec5"></div>
                <div className="container">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="flexdiv">
                                <div className="invite-left">
                                    <h4>
                                        Invite Friends
                                    </h4>
                                    <p>Why not share the love and invite a friend today? Simply use our easy-to-use invitation form, add your friend's email, and send them a personalized message. We'll take care of the rest and let them know about our platform.</p>
                                    <div className="inisend">
                                        <label>
                                            Email
                                        </label>
                                        <div className="initrequest">
                                            <input type="text" placeholder="Enter Your Friend Email Address" />
                                            <button>
                                                Send Invitation
                                            </button>
                                        </div>
                                        <div className="iconList3">
                                            <a href="#">
                                                <img src="images/whats.png" />
                                            </a>
                                            <a href="#">
                                                <img src="images/telegram.png" />
                                            </a>
                                            <a href="#">
                                                <img src="images/mail.png" />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="invite-right">
                                <img src="images/invite.png" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Index;
