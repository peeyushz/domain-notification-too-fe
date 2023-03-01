import { useEffect, useState } from "react";

import StepRangeSlider from "react-step-range-slider";

const Index = () => {
    const years = [
        { key: "2020", label: "2020" },
        { key: "2019", label: "2019" },
        { key: "2018", label: "2018" },
        { key: "2017", label: "2017" },
        { key: "2016", label: "2016" },
        { key: "2015", label: "2015" },
        { key: "2014", label: "2014" },
        { key: "2013", label: "2013" },
        { key: "2012", label: "2012" },
        { key: "2011", label: "2011" },
        { key: "2010", label: "2010" },
        { key: "2009", label: "2009" },
        { key: "2008", label: "2008" },
        { key: "2007", label: "2007" },
        { key: "2006", label: "2006" },
        { key: "2005", label: "2005" },
        { key: "2004", label: "2004" },
        { key: "2003", label: "2003" },
        { key: "2002", label: "2002" },
        { key: "2001", label: "2001" }
    ];
    const stepsRanges = years.map((step, index) => {
        const isLast = years.length === index + 1;
        if (isLast) {
            return {
                value: step
            };
        }
        return {
            value: step,
            step: years[index + 1] - step
        };
    });
    const range = [
        {
            value: 1,
            step: 9
        },
        {
            value: 10,
            step: 10
        },
        {
            value: 5000,
            step: 0
        }
    ];
    const [stepRangeValue, setStepRangeValue] = useState(range[0].key);
    

    return (
        <>
            <section className="pricingsec">
                <div id="sec4"></div>
                <div className="container">
                    <div className="row">
                        <div className="col-md-6">

                            <div className="headings-1">
                                <h2>
                                    Pricing
                                </h2>
                                <p>Choose the right plan for you, starting at just </p>
                                <p className="priceper">$9.99<span> per month!</span></p>
                            </div>

                            <div className="dataprice">
                                <div className={stepRangeValue===undefined||(stepRangeValue>0&&stepRangeValue<101)?"tabscss activeTab":"tabscss"}>
                                    <h4>$9.99</h4>
                                    <p>100 Domains</p>
                                </div>
                                <div className={stepRangeValue>100&&stepRangeValue<501?"tabscss activeTab":"tabscss"}>
                                    <h4>$39.99</h4>
                                    <p>500 Domains</p>
                                </div>
                                <div className={stepRangeValue>500&&stepRangeValue<2001?"tabscss activeTab":"tabscss"}>
                                    <h4>$199.99</h4>
                                    <p>2000 Domains</p>
                                </div>
                                <div className={stepRangeValue>2000&&stepRangeValue<5001?"tabscss activeTab":"tabscss"}>
                                    <h4>$599.99</h4>
                                    <p>5000 Domains</p>
                                </div>
                            </div>
                            <div className="sildercss">
                                <p>1. Select Domains</p>
                                <StepRangeSlider
                                    value={stepRangeValue}
                                    range={range}
                                    onChange={(value) => setStepRangeValue(value)}
                                />
                            </div>
                            <p className="headsecond">2. Select Notification Type</p>
                            <div className="typebox">
                                <div className="allbox">
                                    <div className="socilcard">
                                        <img src="images/whatsapp.png" />
                                        <p>WhatsApp</p>
                                    </div>
                                </div>
                                <div className="allbox">
                                    <div className="socilcard">
                                        <img src="images/noti1.png" />
                                        <p>Email</p>
                                    </div>
                                </div>
                                {/* <div className="allbox">
                                    <div className="socilcard">
                                        <img src="images/noti2.png" />
                                        <p>Telegram</p>
                                    </div>
                                </div> */}
                                <div className="allbox">
                                    <div className="socilcard">
                                        <img src="images/noti3.png" />
                                        <p>SMS</p>
                                    </div>
                                </div>
                                {/* <div className="allbox">
                                    <div className="socilcard">
                                        <img src="images/noti4.png" />
                                        <p>Voice Calls</p>
                                    </div>
                                </div> */}
                            </div>
                            <div className="summerycss">
                                <h4>Summary</h4>
                                <div className="inter-secd">
                                    <div className="dclass">
                                        <p>1,000 monitors</p>
                                        <p>Easily manage all your web3 domains from one place</p>
                                        <p>24/7 Support</p>
                                    </div>
                                    <div className="dclass" >
                                        <p>500 domains</p>
                                        <p>40 SMS alerts (I) (Purchase Additional)</p>
                                        <p>Email, WhatsApp & SMS Alerts</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="checkoutsec">
                                <div className="checkoutsec-1">
                                    <h4 className="textcheck">CHECKOUT</h4>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="checkform">
                                                <label>
                                                    First Name
                                                </label>
                                                <input type="text" placeholder="Enter First Name" />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="checkform">
                                                <label>
                                                    Last Name
                                                </label>
                                                <input type="text" placeholder="Enter Last Name" />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="checkform">
                                                <label>
                                                    Phone Number
                                                </label>
                                                <input type="number" placeholder="Phone Number" />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="checkform">
                                                <label>
                                                    Email
                                                </label>
                                                <input type="email" placeholder="Enter Email" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="paymentMethod">
                                        <h4>Select Payment Method</h4>
                                        <div className="paywallet">
                                            <div className="paycard">
                                                <label>
                                                    <input
                                                        type="radio"
                                                        name="letter"
                                                        value="a"
                                                    // checked={value === "a"}
                                                    // onChange={this.handleChange}
                                                    />{" "}
                                                    Debit Card
                                                </label>
                                            </div>
                                            <div className="paycard">
                                                <label>
                                                    <input
                                                        type="radio"
                                                        name="letter"
                                                        value="b"
                                                    // checked={value === "b"}
                                                    // onChange={this.handleChange}
                                                    />{" "}
                                                    Cryptocurrency
                                                </label>
                                            </div>
                                            <div className="paycard">
                                                <label>
                                                    <input
                                                        type="radio"
                                                        name="letter"
                                                        value="c"
                                                    // checked={value === "c"}
                                                    // onChange={this.handleChange}
                                                    />{" "}
                                                    Google Pay
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="checkform">
                                                <label>
                                                    Card Number
                                                </label>
                                                <input type="number" placeholder="Enter Card Number" />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="checkform">
                                                <label>
                                                    Card Holder Name
                                                </label>
                                                <input type="number" placeholder="Enter Card Holder Number" />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="checkform">
                                                <label>
                                                    CVV Number
                                                </label>
                                                <input type="number" placeholder="Enter CVV" />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="checkform">
                                                <label>
                                                    Expiry Date
                                                </label>
                                                <input type="number" placeholder="11/29" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="alltotl">
                                        <div className="totalfeilds">
                                            <label>Subtotal:</label>
                                            <p>$1952</p>
                                        </div>
                                        <div className="totalfeilds">
                                            <label>Discount:</label>
                                            <p>$0.00</p>
                                        </div>
                                        <div className="totalfeilds">
                                            <label>Total:</label>
                                            <p>$1952</p>
                                        </div>
                                    </div>
                                    <div className="buttoncheck">
                                        <button>
                                            Checkout <img src="images/arrow.png" style={{ paddingBottom: "3px", paddingLeft: "10px" }} />
                                        </button>
                                    </div>
                                </div>
                                <div className="">
                                    <div className="btmtext">
                                        <img src="images/secure.png" /> Secured Transaction
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
