import { useEffect, useState, useRef, useLayoutEffect } from "react";
import PhoneInput from "react-phone-input-2";
import StepRangeSlider from "react-step-range-slider";
import { baseUrl } from "../../../details";
import axios from "axios";
import PlanCard from "./PlanCard"
import parsePhoneNumber from 'libphonenumber-js'
import { toast } from 'react-toastify';
import Cookies from "universal-cookie";
import LoaderButton from "../../common/LoaderButton";

const Index = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [currentStep, setCurrentStep] = useState(1);
    const [planTypeSelected, setPlanTypeSelected] = useState("Monthly");
    const [selectedPlanIndex, setSelectedPlanIndex] = useState(0);
    const [stepRangeValue, setStepRangeValue] = useState(1);
    const [selectWhatsappAlert, setSelectWhatsappAlert] = useState(false)
    const [selectEmailAlert, setSelectEmailAlert] = useState(false)
    const [selectSmsAlert, setSelectSmsAlert] = useState(false)
    const [plansData, setPlansData] = useState([{_id: null, planType: null, domainLimit: null, price: null, createdAt: null}]);
    const firstNameRef = useRef();
    const lastNameRef = useRef();
    const emailRef = useRef();
    const subtotalRef = useRef();
    const totalRef = useRef();
    const [phoneNo, setPhoneNo] = useState();
    const [countryCode, setCountryCode] = useState("91");
    const [selectedPlanId, setSelectedPlanId] = useState(null);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("utrust");
    const cookies = new Cookies();
    const jwt_token = cookies.get("token")
    
    useEffect(()=>{
        if(plansData[0]._id===null){
            const config = {
                method: 'get',
                url: `${baseUrl}/api/get-plans-data`,
                headers: {}
            };
            axios(config)
            .then(function (response) {
                if(response.data.success){
                    setPlansData(response.data.data)
                }
            })
            .catch(function (error) {
                console.log(error);
            });
        }
    },[])

    useEffect(()=>{
        let filteredPlans = plansData.filter((plan)=>plan.planType===planTypeSelected)
        for(let i=0;i<filteredPlans.length;i++){
            console.log(stepRangeValue,"2")
            console.log(filteredPlans[i].domainLimit,"22")
            if((stepRangeValue>filteredPlans[i-1]?.domainLimit || i===0) && stepRangeValue<=filteredPlans[i].domainLimit){
                setSelectedPlanIndex(i);
            }
        }
    },[stepRangeValue, planTypeSelected])

    useEffect(()=>{
        console.log(selectedPlanIndex)
    },[selectedPlanIndex])
    useEffect(()=>{
        if(currentStep===3){
            const price = plansData.filter(plan=>plan._id===selectedPlanId)[0].price;
            subtotalRef.current.innerText = "$"+price;
            totalRef.current.innerText = "$"+price;
        }
    },[currentStep])

    const range = [
        {
            value: 1,
            step: 19
        },
        {
            value: 20,
            step: 20
        },
        {
            value: 100,
            step: 50
        },
        {
            value: 500,
            step: 250
        },
        {
            value: 1000,
            step: 500
        },
        {
            value: plansData.filter((plan)=>plan.planType===planTypeSelected).map(plan=>plan.domainLimit).sort((a,b)=> a-b).slice(-1)[0],
            step: 0
        },
    ];

    const changeWhatsappSelection = ()=>{
        setSelectWhatsappAlert(!selectWhatsappAlert);
    }
    const changeEmailSelection = ()=>{
        setSelectEmailAlert(!selectEmailAlert);
    }
    const changeSmsSelection = ()=>{
        setSelectSmsAlert(!selectSmsAlert);
    }

    const handleStep1Next = ()=>{
        if(currentStep===1){
            let requiredPlanId;
            for(let i=0;i<plansData.length;i++){
                if(i == 0){
                    if(plansData[i].planType===planTypeSelected &&stepRangeValue<=plansData[i].domainLimit){
                        requiredPlanId= plansData[i]._id;
                        break;
                    }
                }else{
                    if(plansData[i].planType===planTypeSelected && stepRangeValue>plansData[i-1]?.domainLimit &&stepRangeValue<=plansData[i].domainLimit){
                        requiredPlanId= plansData[i]._id;
                        break;
                    }
                }
                
            }
            if(requiredPlanId!==undefined){
                setCurrentStep(2);
                setSelectedPlanId(requiredPlanId);
            }
        }
    }
    
    const validateFields = (formData)=>{
        let isValid=true, msg;
        if(formData.firstName==="" || formData.lastName===""|| formData.email===""){
          isValid = false;
          msg="Please make sure all fields are filled"
        }
        else if(!(/^[a-zA-Z ]{3,30}$/.test(formData.firstName+" "+formData.lastName))){
          isValid = false;
          msg="Name should of 3 to 25 characters and cannot contain digits and special characters";
        }
        else if(!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(formData.email))){
          isValid = false;
          msg="Invalid Email";
        }
        else if(!parsePhoneNumber("+"+phoneNo).isValid()){
          isValid = false;
          msg="Invalid Phone Number";
        }
        return {"isValid":isValid, "msg":msg};
    }

    const handleCheckout = ()=>{
        if(selectedPaymentMethod==="utrust" || selectedPaymentMethod==="stripe"){
            setIsLoading(true);
            const formData = {
                "firstName": firstNameRef.current.value,
                "lastName": lastNameRef.current.value,
                "email": emailRef.current.value
            }
            const validateResponse = validateFields(formData);
            if(validateResponse.isValid){
                let alertSelected=[]
                if(selectWhatsappAlert){
                    alertSelected.push("whatsapp");
                }
                if(selectEmailAlert){
                    alertSelected.push("email");
                }
                if(selectSmsAlert){
                    alertSelected.push("sms");
                }
                var data = JSON.stringify({
                    "planid": selectedPlanId,
                    "name": formData.firstName+" "+formData.lastName,
                    "phoneNo": phoneNo.replace(countryCode,""),
                    "email": formData.email,
                    "countryCode": "+"+countryCode,
                    "alertType": alertSelected
                });

                const config = {
                    method: 'post',
                    url: selectedPaymentMethod==="utrust"?`${baseUrl}/api/pay-with-utrust`:selectedPaymentMethod==="stripe"?`${baseUrl}/api/pay-with-stripe`:selectedPaymentMethod==="paypal"?`${baseUrl}/api/pay-with-paypal`:null,
                    headers: {
                        'token': jwt_token,
                        'Content-Type': 'application/json'
                    },
                    data : data
                };
                axios(config)
                .then(function (response) {
                    if(response.data.success){
                        window.location.href= response.data.data;
                        setIsLoading(false);
                    }
                    else{
                        toast.error(response.data.msg, {
                            position: toast.POSITION.BOTTOM_RIGHT,
                            autoClose: 2000,
                            className: 'toast-message-error'
                        });
                        setIsLoading(false);
                    }
                })
                .catch(function (error) {
                    console.log(error);
                    setIsLoading(false);
                });
            }
            else{
                setIsLoading(false);
                toast.error(validateResponse.msg, {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    autoClose: 2000,
                    className: 'toast-message-error'
                });
            }
        }
    }

    const handleRadio = radio => {
        setSelectedPaymentMethod(radio);
    };

    return (
        <>
            <section className="" >
                <div className="container">
                    <div className="row">
                        <div className="col-md-7 m-auto">
                            <div className="logotop">
                                <img src="images/logo.png" />
                            </div>
                            <div className="tabpanelbox">
                                <div className="topDotLine"></div>
                                <div className="tab-switch">
                                    <div className={currentStep===1?"tabinner1 tabdiv-1 activetab":"tabinner1 tabdiv-1"}>
                                        <h2>01</h2>
                                        <p>Select<br></br>Numbers of Domain</p>
                                    </div>
                                    <div className={currentStep===2?"tabinner1 tabdiv-2 activetab":"tabinner1 tabdiv-2"}>
                                        <h2>02</h2>
                                        <p>Select<br></br>Type of Alert</p>
                                    </div>
                                    <div className={currentStep===3?"tabinner1 tabdiv-3 activetab":"tabinner1 tabdiv-3"}>
                                        <h2>03</h2>
                                        <p>Checkout</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="domainlistSec" style={currentStep===1?{}:{display:"none"}}>
                <div className="container">
                    <div className="row">
                        <div className="col-md-10 m-auto">
                            <div className="domianboxs">
                                <div className="domain-head">
                                    <h4>Select Numbers of Domain</h4>
                                </div>
                                <div className="middled">
                                    <p>Select Payment Plan</p>
                                    <div className="plantype">
                                        <button type="button" onClick={()=>setPlanTypeSelected("Monthly")} className={planTypeSelected==="Monthly"?"button-add":""}>Monthly</button>
                                        <button type="button" onClick={()=>setPlanTypeSelected("Yearly")} className={planTypeSelected==="Yearly"?"button-add":""}>Yearly</button>
                                    </div>
                                </div>
                                <div className="listofdomian">
                                    {plansData.filter(plan=>plan.planType===planTypeSelected).map((plan,i)=>{
                                        return(
                                        <PlanCard
                                            key={`plan-${i}`}
                                            planPrice={plan.price}
                                            domainLimit={plan.domainLimit}
                                            active={selectedPlanIndex===i}
                                            onClick={()=>{setStepRangeValue(plan.domainLimit)}}
                                        />)
                                    })}
                                    
                                </div>
                                <div className="slider2">
                                    <StepRangeSlider
                                        value={stepRangeValue}
                                        range={range}
                                        onChange={(value) => setStepRangeValue(value)}
                                    />
                                    <div className="rating">
                                        <p>1</p>
                                        <p>{range.slice(-1)[0].value}</p>
                                    </div>
                                </div>
                                <div className="buttonbtm">
                                    <button onClick={handleStep1Next} type="button">Next <img src="images/arrow.png" style={{ paddingBottom: "3px", paddingLeft: "10px" }} /></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="domainlistSec" style={currentStep===2?{}:{display:"none"}} >
                <div className="container">
                    <div className="row">
                        <div className="col-md-10 m-auto">
                            <div className="domianboxs">
                                <div className="slider2 sildercss">
                                    <StepRangeSlider
                                        value={stepRangeValue}
                                        range={range}
                                        disabled={true}
                                    />
                                    <div className="rating">
                                        <p>1</p>
                                        <p>{range.slice(-1)[0].value}</p>
                                    </div>
                                </div>
                                <div className="domain-head">
                                    <h4>Select Type of Alert</h4>
                                </div>

                                <div className="listofdomian">
                                    <button className="listsecond" onClick={changeWhatsappSelection} style={selectWhatsappAlert?{background:"#8cdba9"}:{}}>
                                        <img src="images/whatsapp.png" />
                                        <p>WhatsApp</p>
                                    </button>
                                    <button onClick={changeEmailSelection} className="listsecond" style={selectEmailAlert?{background:"#8cdba9"}:{}}>
                                        <img src="images/noti1.png" />
                                        <p>Email</p>
                                    </button>
                                    <button onClick={changeSmsSelection} className="listsecond" style={selectSmsAlert?{background:"#8cdba9"}:{}}>
                                        <img src="images/noti3.png" />
                                        <p>SMS</p>
                                    </button>
                                    {/* <div className=" listsecond">
                                        <img src="images/noti2.png" />
                                        <p>Telegram</p>
                                    </div>
                                    
                                    {/* <div className=" listsecond">
                                        <img src="images/noti4.png" />
                                        <p>Voice Calls</p>
                                    </div> */}
                                </div>
                                <div className="buttonbtm">
                                    <button type="button" onClick={()=>setCurrentStep(1)}><img src="images/arrow-left.png" style={{ paddingBottom: "3px", paddingLeft: "10px" }} /> &nbsp;Back </button>
                                    <button type="button" onClick={()=>setCurrentStep(3)}>Next <img src="images/arrow.png" style={{ paddingBottom: "3px", paddingLeft: "10px" }} /></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="domainlistSec" style={currentStep===3?{}:{display:"none"}}>
                <div className="container">
                    <div className="row">
                        <div className="col-md-10 m-auto">
                            <div className="domianboxs">
                                <div className="row">
                                    <div className="col-md-7">
                                        <div className="">
                                            <div className="checkoutsec-1">
                                                <h4 className="textcheck">CHECKOUT</h4>
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <div className="checkform">
                                                            <label>First Name</label>
                                                            <input type="text" placeholder="Enter First Name" ref={firstNameRef} />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="checkform">
                                                            <label>
                                                                Last Name
                                                            </label>
                                                            <input type="text" placeholder="Enter Last Name" ref={lastNameRef}/>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="checkform">
                                                            <label>
                                                                Phone Number
                                                            </label>
                                                            <PhoneInput
                                                                country={"in"}
                                                                inputStyle={{
                                                                    background: "#f3f5f6",
                                                                    width: "100%",
                                                                    height: "44px",
                                                                    borderRadius: "9px",
                                                                    marginTop: "5px",
                                                                }}
                                                                value={phoneNo}
                                                                onChange={(phone, e) => {
                                                                    setCountryCode(e.dialCode);
                                                                    setPhoneNo(phone);
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="checkform">
                                                            <label>
                                                                Email
                                                            </label>
                                                            <input type="email" placeholder="Enter Email" ref={emailRef} />
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
                                                                    name="paymentType"
                                                                    value="utrust"
                                                                    onClick={()=>handleRadio("utrust")}
                                                                    checked={selectedPaymentMethod==="utrust"}
                                                                />{" "}Utrust
                                                            </label>
                                                        </div>
                                                        <div className="paycard">
                                                            <label>
                                                                <input
                                                                    type="radio"
                                                                    name="paymentType"
                                                                    value="stripe"
                                                                    onClick={()=>handleRadio("stripe")}
                                                                    checked={selectedPaymentMethod==="stripe"}
                                                                />{" "}Stripe
                                                            </label>
                                                        </div>
                                                        <div className="paycard">
                                                            <label disabled>
                                                                <input
                                                                    type="radio"
                                                                    name="paymentType"
                                                                    value="paypal"
                                                                    onClick={()=>handleRadio("paypal")}
                                                                    checked={selectedPaymentMethod==="paypal"}
                                                                    disabled
                                                                />{" "}PayPal
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* <div className="row">
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
                                                </div>*/}

                                                <div className="buttoncheck mt-5">
                                                    {isLoading?
                                                    <LoaderButton/>
                                                    :<button onClick={handleCheckout}>
                                                        Checkout <img src="images/arrow.png" style={{ paddingBottom: "3px", paddingLeft: "10px" }} />
                                                    </button>

                                                    }
                                                    
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                    <div className="col-md-5">
                                        <div className="slider2 sildercss">
                                            <StepRangeSlider
                                                value={stepRangeValue}
                                                range={range}
                                                disabled={true}
                                            />
                                            <div className="rating">
                                                <p>1</p>
                                                <p>{range.slice(-1)[0].value}</p>
                                            </div>
                                        </div>
                                        <div className=" typebox-new">
                                            <div className="allbox">
                                                <div className="socilcard" style={selectWhatsappAlert?{background:"#8cdba9"}:{}}>
                                                    <img src="images/whatsapp.png" />
                                                    <p>WhatsApp</p>
                                                </div>
                                            </div>
                                            <div className="allbox">
                                                <div className="socilcard" style={selectEmailAlert?{background:"#8cdba9"}:{}}>
                                                    <img src="images/noti1.png" />
                                                    <p>Email</p>
                                                </div>
                                            </div>
                                            <div className="allbox">
                                                <div className="socilcard" style={selectSmsAlert?{background:"#8cdba9"}:{}}>
                                                    <img src="images/noti3.png" />
                                                    <p>SMS</p>
                                                </div>
                                            </div>

                                        </div>
                                        <div className="alltotl">
                                            <div className="totalfeilds">
                                                <label>Subtotal:</label>
                                                <p ref={subtotalRef}></p>
                                            </div>
                                            <div className="totalfeilds">
                                                <label>Discount:</label>
                                                <p>$0.00</p>
                                            </div>
                                            <div className="totalfeilds">
                                                <label>Total:</label>
                                                <p ref={totalRef}>$1952</p>
                                            </div>
                                        </div>
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
