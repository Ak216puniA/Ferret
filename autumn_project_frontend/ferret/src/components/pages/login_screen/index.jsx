import React, { Component } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import './index.css'

class LoginScreen extends Component {
  render() {
    const login_state = useSelector((state) => state.login.loading)
    return (
      <div className='loginScreen'>
        <div>{login_state}</div>
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