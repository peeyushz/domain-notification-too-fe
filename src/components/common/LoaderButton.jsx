import React from 'react'

function LoaderButton({btnText}) {
  return (
    <div>
        <button className="btn btn-grd" disabled><img className="loaderImg" style={{filter:"invert(100%)"}} src="images/loader.gif" alt="" />{btnText}</button>
    </div>
  )
}

export default LoaderButton