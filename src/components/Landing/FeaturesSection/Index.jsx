import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import StepRangeSlider from "react-step-range-slider";

const Index = () => {

    return (
        <>
            <section className="featuressec" >
                <div id="sec3"></div>
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="headings">
                                <h2>
                                    Features
                                </h2>
                            </div>
                        </div>
                        <div className="col-md-3 mb-3">
                            <div className="cardbx">
                                <img src="images/feat1.png" />
                                <p>Real-time alerts via email, SMS, Telegram, and Voice call</p>
                            </div>
                        </div>
                        <div className="col-md-3 mb-3">
                            <div className="cardbx">
                                <img src="images/feat2.png" />
                                <p>Monitoring of multiple domains from a single dashboard</p>
                            </div>
                        </div>
                        <div className="col-md-3 mb-3">
                            <div className="cardbx">
                                <img src="images/feat3.png" />
                                <p>Customizable alert settings and expiration reminders.</p>
                            </div>
                        </div>
                        <div className="col-md-3 mb-3">
                            <div className="cardbx">
                                <img src="images/feat4.png" />
                                <p>Secure, easy-to-use platform</p>
                            </div>
                        </div>
                    </div>
                    <div className="belowsec">
                        <div className="row">
                            <div className="col-md-6">
                                <div className="cardbx-btm">
                                    <div className="imgleftv">
                                        <img src="images/feat5.png" />
                                    </div>
                                    <div className="ctn-right">
                                        <h4>Alerts Included</h4>
                                        <p>Never miss a domain expiration with our timely and reliable alert system. We'll notify you via email, SMS, and voice call, so you're always up-to-date on your web3 domains.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="cardbx-btm">
                                    <div className="imgleftv">
                                        <img src="images/feat5.png" />
                                    </div>
                                    <div className="ctn-right">
                                        <h4>Alert Types</h4>
                                        <p>Choose the type of alerts that suit you best. We offer email, SMS, and voice call alerts, so you can pick the one that works best for you.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="cardbx-btm">
                                    <div className="imgleftv">
                                        <img src="images/feat6.png" />
                                    </div>
                                    <div className="ctn-right">
                                        <h4>Domain Management</h4>
                                        <p>Easily manage all your web3 domains from one place. Our platform gives you complete control over your domains, so you never have to worry about losing a valuable asset.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="cardbx-btm">
                                    <div className="imgleftv">
                                        <img src="images/feat7.png" />
                                    </div>
                                    <div className="ctn-right">
                                        <h4>Secure Transactions</h4>
                                        <p>All transactions on our platform are fully secure and encrypted, ensuring the safety of your domain assets.</p>
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
