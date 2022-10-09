import React, { Component } from 'react'
import './index.css'

class LoginScreen extends Component {
  render() {
    return (
      <div className='loginScreen'>
        <div className='loginScreenDiv1'>
          <div className={`loginScreenTriangleDiv loginScreenTriangleUp`}>
            <div className='topRightCornerWhite'></div>
          </div>
        </div>
        <div className='loginScreenDiv2'>
            <button className='loginButton'>Login with Omniport</button>
            <div className={`loginScreenTriangleDiv loginScreenTriangleDown`}>
              <div className='bottomLeftCornerBlue'></div>
            </div>
        </div>
      </div>
    )
  }
}

export default LoginScreen