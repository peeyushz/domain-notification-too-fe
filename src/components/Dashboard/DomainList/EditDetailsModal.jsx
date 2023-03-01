import {useState, useRef, useEffect} from "react"
import Modal from 'react-bootstrap/Modal';
import Multiselect from 'multiselect-react-dropdown';
import { baseUrl } from "../../../details";
import Cookies from "universal-cookie";
import axios from "axios";
import { toast } from "react-toastify";
import LoaderButton from "../../common/LoaderButton";

const EditDetails = ({name, alerts, alertEpoc , domainId, handlereload, expiry, status})=>{
    const [show, setShow] = useState(false);
    const [loading, setIsLoading] = useState(false);
    const alertsRef = useRef()
    const timeRef = useRef()
    const dateRef = useRef()
    const cookies = new Cookies();
    const jwt_token = cookies.get("token")
    
    useEffect(()=>{
        if(show===true && status!=="Grace Period"){
            const defaultAlertDate = new Date(alertEpoc*1000);
            let iso_default = defaultAlertDate.toLocaleString().split(",")
            dateRef.current.value = iso_default[0].split("/").reverse().join("-");
            timeRef.current.value = iso_default[1].substring(1,6);
        }
    },[show])

    const dropDownOptions = [
        {key: 'WhatsApp', id: 1, value: "whatsapp"},
        {key: 'E-Mail', id: 2, value: "email"},
        {key: 'SMS', id: 3, value: "sms"}
    ]

    const selectedOptions = dropDownOptions.filter(opt=>{
        if(alerts.includes(opt.value)){
            return opt
        }
    })

    const handleClose = () => setShow(false);

    const callUpdate = (data)=>{
        const config = {
            method: 'post',
            url: `${baseUrl}/api/update-domain-data`,
            headers: {
              'token': jwt_token,
              'Content-Type': 'application/json'
            },
            data : data
        };
        axios(config)
        .then(function (response) {
            if(response.data.success){
                toast.success('Updated Successfully!', {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 2000
                });
                setIsLoading(false);
                handlereload(true);
                handleClose();
            }
            else{
                toast.error("Error while updating " + response.data.msg , {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 2000
                });
                setIsLoading(false)
            }
        })
        .catch(function (error) {
            console.log(error);
            toast.error("Error while updating" , {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 2000
            });
            setIsLoading(false)
        });
    }

    const handleSubmit = ()=>{
        setIsLoading(true);
        if(alertsRef.current.getSelectedItems().length === 0){
            toast.error("Please select atleast one type alert", {
              position: toast.POSITION.BOTTOM_RIGHT,
              autoClose: 2000
            });
            setIsLoading(false);
        }
        else if(status==="Grace Period"){
            const data = {
                "domainId": domainId,
                "alerts":alertsRef.current.getSelectedItems().map(val=>val.value),
            };
            callUpdate(data);
        }
        else if(status!=="Grace Period"){
            const epoch_entered = (new Date(dateRef.current.value+"T"+timeRef.current.value+":00.000000").getTime()) / 1000
            if(epoch_entered<(Math.floor(expiry/100)*100)){
                const data = {
                    "domainId": domainId,
                    "alertTime":timeRef.current.value,
                    "alerts":alertsRef.current.getSelectedItems().map(val=>val.value),
                    "alertTime":epoch_entered
                };
                callUpdate(data);
            }
            else{
                toast.error("Please enter an Alert Date which is prior to the ENS Domain Expiry Date" , {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 2000
                });
                setIsLoading(false);
            }
        }  
    }
    

    return(<>
        <button className="btn3s" type="button" onClick={()=>{setShow(true)}}><img src="images/edit.png" /></button>
        <Modal show={show} onHide={handleClose} className="QRbox" backdrop="static" keyboard={false}>
                <Modal.Header className="closebtn">
                    <Modal.Title className="headertimer" >Edit Domain</Modal.Title>
                    <button type="button" onClick={handleClose} style={{ fontSize: "15px", background: "transparent",  padding: "0px 7px",  borderRadius: "31px", fontWeight: "600", lineHeight: "22px"}}>
                        x
                    </button>
                </Modal.Header>
                <Modal.Body>
                    <div className="model-details">
                        <div className="doDiv">
                            <label>Domain Name</label>
                            <p>{name}</p>
                        </div>
                        {status!=="Grace Period"?
                            <><div className="doDiv">
                                <label>Alert Date</label>{'\u00A0'}
                                <input 
                                    type="date"
                                    ref={dateRef}
                                />
                            </div>
                            <div className="doDiv">
                                <label>Alert Time</label>{'\u00A0'}
                                <input type="time" ref={timeRef}/>
                            </div></>:
                            null
                        }
                        <div className="doDiv">
                            <label>Alert Notifications</label>
                            <Multiselect
                                options={dropDownOptions}
                                displayValue="key"
                                ref={alertsRef}
                                selectedValues= {selectedOptions}
                            />
                        </div>
                        <div className="innereilds text-center">
                            {loading?<LoaderButton/>:<button className="ml-1" onClick={()=>handleSubmit()}>Submit</button>}
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
            </>
    )
}

export default EditDetails