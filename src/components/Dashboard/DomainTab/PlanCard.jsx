
const PlanCard = ({planPrice, domainLimit, active, onClick})=>{
    return(
    <div className="listsingle" style={active?{background:"#1b9e49", color:"white"}:{}} onClick={onClick}>
        <h4>${planPrice}</h4>
        <p>{domainLimit} Domains</p>
    </div>
    )
}

export default PlanCard;