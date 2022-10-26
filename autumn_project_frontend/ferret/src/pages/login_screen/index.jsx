import React, { Component } from 'react'
// import { useSelector, useDispatch } from 'react-redux'
// import { connect } from 'react-redux'
// import { loginUser } from '../../../features/login/loginSlice'


import './index.css'

class LoginScreen extends Component {

  // constructor(props) {
  //   super(props)
  
  //   this.state = {
  //   }
  // }

  // logmein = () => {
  //   this.props.loginUser()
  //   console.log(this.props.user)
  // }

  // logmein = () => {
  //   this.props.loginUser()
  // }

  // LoginRequest = () => {
  //   window.location.href = "http://localhost:8000/auth/auth_code";
  // }

  // listState = () => {
  //   console.log(this.props.loading)
  //   console.log(this.props.user)
  //   console.log(this.props.error)
  // }

  render() {
    // const login_state = useSelector((state) => state.login.loading)
    return (
      <div className='loginScreen'>
        <div>{this.props.loading}</div>
        <div className='loginScreenDiv1'>
          <div className={`loginScreenTriangleDiv loginScreenTriangleUp`}>
            <div className='topRightCornerWhite'></div>
          </div>
        </div>
        <div className='loginScreenDiv2'>
          <button>list the state</button>
          {/* <button onClick={this.listState}>list the state</button> */}
          <a href='http://localhost:8000/auth/auth_code/'>
            <button className='loginButton'>Login with Omniport</button>
          </a>
          {/* <button className='loginButton' onClick={() => this.props.loginUser()}>Login with Omniport</button> */}
          <div className={`loginScreenTriangleDiv loginScreenTriangleDown`}>
            <div className='bottomLeftCornerBlue'></div>
          </div>
        </div>
      </div>
    )
  }
}

// const mapStateToProps = (state) => {
//   return {
//     // loading : state.loading,
//     // loading : 'hello',
//     loading : state.loading,
//     user : state.user,
//     error : state.error
//   }
// }

// const mapDispatchToProps = (dispatch) => {
//   return {
//     loginUser : () => {
//       dispatch(loginUser())
//     }
//   }
// }

// export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen)
export default LoginScreen