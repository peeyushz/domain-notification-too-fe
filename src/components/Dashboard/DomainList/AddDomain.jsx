import React, {useState, useRef, useContext} from "react";
import Multiselect from 'multiselect-react-dropdown';
import { toast } from 'react-toastify';
import { baseUrl } from "../../../details";
import axios from "axios";
import Cookies from "universal-cookie";
import LoaderButton from "../../common/LoaderButton"
import { Buffer } from "buffer/";
import keccakHelper from "keccak";
import {UserDetailsContext} from "../../../context/UserDetails"
window.Buffer = window.Buffer || Buffer;
const initialValue = {"isSet":false,"expiry":""}

const getDateString =(epoc)=>{
    let defaultAlertDate = new Date(epoc);
    const year = defaultAlertDate.getFullYear()
    let month = defaultAlertDate.getMonth()+1;
    month = month.toString().length===2?month:"0"+month
    const date = defaultAlertDate.getDate().toString().length===2?defaultAlertDate.getDate():"0"+defaultAlertDate.getDate()
    return (year+"-"+month+"-"+date)
}
const getTimeString =(epoc)=>{
  let time = new Date(epoc);
  const hours = time.getHours()
  const minutes = time.getMinutes()
  return(hours+":"+minutes)
}

const Index = ({handlereload}) => {
    const cookies = new Cookies();
    const jwt_token = cookies.get("token");
    const alertsRef = useRef();
    const timeRef = useRef();
    const domainNameRef = useRef();
    const dateRef = useRef();
    const [isLoading, setIsLoading] = useState(false)
    const [domainDetails, setDomainDetails] = useState(initialValue);
    const [isVerifying, setIsVerifying] = useState(false)
    const dropDownOptions = [
      {name: 'WhatsApp', id: 1, value: "whatsapp"},
      {name: 'E-Mail', id: 2, value: "email"},
      {name: 'SMS', id: 3, value: "sms"}
    ]
    const userDetails = useContext(UserDetailsContext);
    
    const handleSubmit = () => {
      if(jwt_token!==undefined && userDetails.name!=="" &&  userDetails.name!==null && userDetails.name!==undefined){
        if(alertsRef.current.getSelectedItems().length === 0){
          toast.error("Please select atleast one alert", {
            position: toast.POSITION.BOTTOM_RIGHT,
            autoClose: 2000
          });
        }
        else{
            setIsLoading(true);
            const epoch_entered = (new Date(dateRef.current.value+"T"+timeRef.current.value+":00.000000").getTime()) / 1000
            if(epoch_entered<Math.floor(domainDetails.expiry/100)*100){
              const formData = JSON.stringify({
                "domain":domainNameRef.current.value,
                "alertTime":epoch_entered,
                "alerts":alertsRef.current.getSelectedItems().map(val=>val.value)
              })
              const config = {
                method: 'post',
                url: `${baseUrl}/api/save-domain-data`,
                headers: {
                  'token': jwt_token,
                  'Content-Type': 'application/json',
                  'Access-Control-Allow-Origin' : '*'
                },
                data : formData
              };
              axios(config)
              .then((response)=>{
                if(response.data.success){
                  toast.success('Data Saved Successfully!', {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 2000
                  });
                  domainNameRef.current.value = ""
                  timeRef.current.value = ""
                  dateRef.current.value = ""
                  alertsRef.current.resetSelectedValues();
                  handlereload(true)
                  setIsLoading(false)
                }
                else{
                  toast.error(response.data.msg, {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 2000
                  });
                  domainNameRef.current.value = ""
                  timeRef.current.value = ""
                  dateRef.current.value = ""
                  alertsRef.current.resetSelectedValues();
                  setIsLoading(false)
                }
              })
              .catch(function (error) {
                console.log(error);
                setIsLoading(false)
                toast.error("Cannot process your request right now", {
                  position: toast.POSITION.TOP_RIGHT,
                  autoClose: 2000
                });
                alertsRef.current.resetSelectedValues();
                dateRef.current.value = ""
                domainNameRef.current.value = ""
                timeRef.current.value = ""
              });
            }
            else{
                toast.error("Please enter an Alert Date which is prior to the ENS Domain Expiry Date", {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    autoClose: 2000
                });
                alertsRef.current.resetSelectedValues();
                setIsLoading(false)
            } 
        }
      }
      else{
          toast.error("Please Sign Up or Login First", {
            position: toast.POSITION.BOTTOM_RIGHT,
            autoClose: 2000
          });
          alertsRef.current.resetSelectedValues();
          dateRef.current.value = ""
          domainNameRef.current.value = ""
          timeRef.current.value = ""
      }
    }
    
    const resetDomainDetails = () => {
        setDomainDetails(initialValue)
    }

    const handleVerifyDomain = ()=>{
      setIsVerifying(true);
      if(domainNameRef.current.value===""){
        toast.error("Please enter a Domain Name", {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 2000
        });
        setIsVerifying(false);
      }
      else if(!/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/.test(domainNameRef.current.value)){
        toast.error("Invalid ENS Domain", {
            position: toast.POSITION.BOTTOM_RIGHT,
            autoClose: 2000
        });
        domainNameRef.current.value = "";
        setIsVerifying(false);
      }
      else{
        const hex = "0x"+keccakHelper("keccak256").update(domainNameRef.current.value.split(".")[0]).digest("hex")
        const config = {
          method: 'get',
          url: `https://metadata.ens.domains/mainnet/0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85/${hex}`,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin' : '*'
          },
        };
        axios(config)
        .then((response)=>{
          if(response.status === 200 && response.data.name === domainNameRef.current.value){
              const expiry_epoc = response.data.attributes.filter(attrib=>attrib.trait_type==="Expiration Date")[0].value
              if(expiry_epoc+7776000000<=Math.floor(Date.now())){
                  toast.error("This ENS Domain is expired!", {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    autoClose: 2000
                  });
                  setIsVerifying(false);
                  domainNameRef.current.value = "";
              }
              else if(expiry_epoc<=Math.floor(Date.now())){
                  if(expiry_epoc + 7516800000 <= Math.floor(Date.now())){
                      dateRef.current.value = getDateString(Math.floor(Date.now()));
                      timeRef.current.value = getTimeString(Math.floor(Date.now()));
                  }
                  else{
                      dateRef.current.value = getDateString(expiry_epoc + 7516800000);
                      timeRef.current.value = getTimeString(expiry_epoc + 7516800000);
                  }
                  setDomainDetails({"isSet":true,"domainName":domainNameRef.current.value,"expiry":(expiry_epoc + 7776000000)/1000})
                  setIsVerifying(false)
                  toast.success('ENS Domain Verified', {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 2000
                  });   
              }
              else{
                  dateRef.current.value = getDateString(expiry_epoc - (3 * 24 * 60 * 60 * 1000));
                  timeRef.current.value = getTimeString(expiry_epoc - (3 * 24 * 60 * 60 * 1000));
                  setDomainDetails({"isSet":true, "domainName":domainNameRef.current.value, "expiry":expiry_epoc/1000})
                  setIsVerifying(false)
                  toast.success('ENS Domain Verified', {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 2000
                  });
              }
          }
          else{
              setIsVerifying(false);
              domainNameRef.current.value = "";
              toast.error("ENS Domain Name is either Invalid not yet Owned by anyone", {
                  position: toast.POSITION.BOTTOM_RIGHT,
                  autoClose: 2000
              });
          }
        })
        .catch(err=>{
            console.log(err)
            setIsVerifying(false);
            domainNameRef.current.value = "";
            toast.error("ENS Domain Name is either Invalid not yet Owned by anyone", {
              position: toast.POSITION.BOTTOM_RIGHT,
              autoClose: 2000
            });
        })
      }
    }
    return(
        <div className="formbox mt-3">
            <div className="innereilds verifyfull">
              <div className="verifydiv1">
                <label>Domain Name</label>
              </div>
              <div className="verifydiv2">
                <input type="text" placeholder="beer.eth" ref={domainNameRef} onChange={()=>resetDomainDetails()} />
                {isVerifying?<LoaderButton/>:<button onClick={handleVerifyDomain} className="ml-1" disabled={domainDetails.isSet} >Verify</button>}
              </div>
            </div>
            <div className="innereilds">
                <label>Select Date</label>
                <input 
                  type="date"
                  ref={dateRef}
                  // max={domainDetails.expiry} 
                  // disabled={domainDetails.isSet?false:true}
                />
            </div>
            <div className="innereilds">
                <label>Select Time</label>
                <input type="time" ref={timeRef} disabled={domainDetails.isSet?false:true}/>
            </div>
            <div className="innereilds multiselectwidth" >
                <label>Alert(s)</label>
                <Multiselect
                    options={dropDownOptions}
                    displayValue="name"
                    ref={alertsRef}
                    disable={domainDetails.isSet?false:true}
                />  
            </div>
            <div className="innereilds">
                {isLoading?<LoaderButton/>:
                <button 
                  onClick={handleSubmit}
                  disabled={domainDetails.isSet?false:true}
                >Submit</button>}
            </div>
        </div>
    )
}

export default Index
