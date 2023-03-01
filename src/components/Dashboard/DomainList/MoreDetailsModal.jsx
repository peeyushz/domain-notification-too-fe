import {useState} from "react"
import Modal from 'react-bootstrap/Modal';

const MoreDetails = ({name, expiry, ownerAddress, listedAt})=>{
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    return(<>
        <button className="btn2s" type="button" onClick={()=>{setShow(true)}}><img src="images/eye.png" /></button>
        <Modal show={show} onHide={handleClose} className="QRbox" backdrop="static" keyboard={false}>
                <Modal.Header className="closebtn">
                    <Modal.Title className="headertimer" >More Details</Modal.Title>
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
                        <div className="doDiv">
                            <label>Date</label>
                            <p>{expiry}</p>
                        </div>
                        <div className="doDiv">
                            <label>Owner</label>
                            <p>{ownerAddress}</p>
                        </div>
                        <div className="doDiv">
                            <label>Listed At</label>
                            <p>{listedAt}</p>
                        </div>
                       
                    </div>
                </Modal.Body>
            </Modal>
            </>
    )
}

export default MoreDetails