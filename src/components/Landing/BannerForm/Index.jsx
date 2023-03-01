import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import StepRangeSlider from "react-step-range-slider";

const Index = () => {
    return (
        <>
            <section className="formsec" >
                <div id="sec2"></div>
                <div className="container">
                    <div className="row">
                        <div className="col-md-10 m-auto col-12 col-lg-8">
                            <div className="formbox">
                                <div className="innereilds">
                                    <label>
                                        Domain Name
                                    </label>
                                    <input type="text" placeholder="beer.eth" />
                                </div>
                                <div className="innereilds">
                                    <label>
                                        Select Date
                                    </label>
                                    <input type="date" placeholder="beer.eth" />
                                </div>
                                <div className="innereilds">
                                    <label>
                                        Select Time
                                    </label>
                                    <input type="time" placeholder="beer.eth" />
                                </div>
                                <div className="innereilds">
                                    <label>
                                        Alert
                                    </label>
                                    <select>
                                        <option>
                                            Icon 1
                                        </option>
                                        <option>
                                            Icon 1
                                        </option>
                                        <option>
                                            Icon 1
                                        </option>
                                        <option>
                                            Icon 1
                                        </option>
                                    </select>
                                </div>
                                <div className="innereilds">
                                    <button>Submit</button>
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
