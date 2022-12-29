import React from 'react'
 import './index.css'

function LoginScreen() {
  return (
    <div className='loginScreen'>
      <div className='loginScreenDiv1'>
        <div className={`loginScreenTriangleDiv loginScreenTriangleUp`}>
          <div className='topRightCornerWhite'></div>
        </div>
      </div>
      <div className='loginScreenDiv2'>
        <a href='http://localhost:8000/auth/auth_code/'>
          <button className='loginButton'>Login with Omniport</button>
        </a>
        <div className={`loginScreenTriangleDiv loginScreenTriangleDown`}>
          <div className='bottomLeftCornerBlue'></div>
        </div>
      </div>
    </div>
  )
}

export default LoginScreen