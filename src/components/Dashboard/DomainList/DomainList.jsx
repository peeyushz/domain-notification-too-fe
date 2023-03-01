import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "universal-cookie";
import { baseUrl } from "../../../details";
import ReactSwitch from 'react-switch';
import MoreDetails from "./MoreDetailsModal"
import EditDetails from "./EditDetailsModal"
import {toast} from "react-toastify"
import Loader from "../../common/Loader"

const Index = ({reload, handlereload}) => {
    const cookies = new Cookies();
    const jwt_token = cookies.get("token")
    const [domainList , setDomainList] = useState([]);
    const [toggleLoading, setTogleLoading] = useState(null)

    const handleToggleChange = (domainId) => {
        setTogleLoading(domainId)
        const data = JSON.stringify({
          "domainId": domainId,
          "areNotificationsEnabled": !domainList.filter(domain=>domain.domainId === domainId)[0].notificationOn
        });

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
                handlereload(true);
                setTogleLoading(null);
            }
            else{
                toast.error(response.data.msg, {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 2000
                });
                setTogleLoading(null)
            }
        })
        .catch(function (error) {
            console.log(error);
            setTogleLoading(null)
        });
    }


    useEffect(()=>{
        let isApiSubscribed = true;
        const getData = async() => {
            const config = {
                method: 'get',
                url: `${baseUrl}/api/get-domain-data`,
                headers: {
                  'token': jwt_token,
                  'Access-Control-Allow-Origin' : '*'
                }
            };
            axios(config)
            .then(function (response) {
                if(response.data.success){
                    setDomainList(response.data.data.map((domain)=>{
                        return {
                            "domainId":domain._id ,
                            "domainName":domain.domain,
                            "ownerAddress":domain.address,
                            "expiry":domain.expiryDate, 
                            "alerts": domain.alerts,
                            "notificationOn":domain.areNotificationsEnabled,
                            "alertTime":domain.alertTime,
                            "status":domain.status
                        };
                    }))
                    handlereload(false)
                }
            })
            .catch(function (error) {
                console.log(error);
            });
            isApiSubscribed = false
        }
        if(isApiSubscribed && reload){
            getData()
        }
        return () =>{
            isApiSubscribed = true;
        }
    },[jwt_token, reload])

    const handleDelete = (id)=>{
        const config = {
            method: 'get',
            url: `${baseUrl}/api/delete-domain-data?domainId=${id}`,
            headers: {
                'token': jwt_token
            }
        };
        axios(config)
        .then(function (response) {
            if(response.data.success){
                handlereload(true)
            }
            else{
                toast.error("Error while deleting the domain", {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 2000
                });
            }
        })
        .catch(function (error) {
            console.log(error);
            toast.error("Error while deleting the domain", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 2000
            });
        });
    }

    const changeToLocalString = (epoc)=>{
        var myDate = new Date( epoc * 1000);
        return myDate.toLocaleString()
    }

    return (
        <div className="mt-5">
            <p>You have {domainList.length} Domains</p>
            {domainList.length!==0?
                domainList.map((domain)=>{
                    return (
                        <div key={domain.domainId} className="domainlistname-outer">
                            <div className="domainlistname">
                                <div className="domian-inner">
                                    <h3>{domain.domainName}</h3>
                                </div>
                                <div className="buttondomain">
                                    {domain.status==="Pending"?<button className="btn1s" style={{background:"gray"}} type="button" disabled>Pending</button>:
                                    domain.status==="Complete"?<button className="btn1s" type="button" disabled>Complete</button>:
                                    domain.status==="Grace Period"?<button className="btn1s" style={{background:"#e69b00"}}  type="button" disabled>Grace Period</button>:
                                    null
                                    }
                                    <MoreDetails 
                                        name={domain.domainName} 
                                        expiry={changeToLocalString(domain.expiry)}
                                        ownerAddress={domain.ownerAddress} 
                                        listedAt="http:"
                                    />
                                    <EditDetails
                                        name = {domain.domainName}
                                        alerts = {domain.alerts}
                                        alertEpoc={domain.alertTime}
                                        domainId = {domain.domainId}
                                        handlereload = {handlereload}
                                        expiry = {domain.expiry}
                                        status = {domain.status}
                                    />
                                    <button className="btn4s" type="button" onClick={()=>{handleDelete(domain.domainId)}}><img src="images/delete.png" /></button>
                                </div>
                            </div>
                            <div className="domainbtmouter">
                                <div className="domainbtm">
                                    <button className="btn1-renew" onClick={()=>window.open(`https://app.ens.domains/name/${domain.domainName}/details`, "_blank")} type="button"><img src="images/renew.png" /> Renew Domain</button>
                                    <label className="btn2-date" style={{fontSize:"small"}}><img src="images/date2.png" />{changeToLocalString(domain.expiry)}</label>
                                </div>
                                <div className="alertsec">
                                    <div className="alrtmsg">
                                        <h4>Alert Message: &nbsp;</h4>
                                        {domain.alerts.includes("whatsapp")?<><img src="images/whtaspp2.png" />{'\u00A0'}</>:null}
                                        {domain.alerts.includes("email")?<><img src="images/mail2.png" />{'\u00A0'}</>:null}
                                        {domain.alerts.includes("sms")?<img src="images/noti3.png" />:null}
                                    </div>
                                    <div className="notify">
                                        <h4>Notifications: &nbsp;</h4>
                                        {toggleLoading!==null&&toggleLoading===domain.domainId?
                                        <Loader/>:
                                        <ReactSwitch
                                            checked={domain.notificationOn}
                                            onChange={()=>handleToggleChange(domain.domainId)}
                                        />}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }):
            null}             
        </div>
    )
}
export default Index