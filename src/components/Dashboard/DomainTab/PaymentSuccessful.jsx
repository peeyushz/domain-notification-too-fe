import { Link } from "react-router-dom";

const PaymentSuccess = ()=>{
    return ( 
        <div className="commonBg">
            <section className="bgImages">
                <div className="container-fluid">
                    <div className="row  Average-chart mt-4 mb-5">
                        <div className="col-md-12">
                            <div className="headerpage">
                                <Link to="/"><img className="logoimg11" src="images/logo.png" /></Link>
                            </div>
                            <div className="FormBOx">
                                <div className='container-fluid d-flex justify-content-center align-item-center' style={{ height: '275px', marginTop: "80px", alignItems: "center" }}>
                                    <div className="row">
                                        <div className="col-12 color-white text-center" style={{ padding: "" }} >
                                            <h1>Payment Successful</h1>
                                            <h3 className='' style={{ color: 'black' }}>
                                                Click <Link to='/domain-list' style={{ color: "green" }}>here</Link> to back to Dashboard
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default PaymentSuccess;