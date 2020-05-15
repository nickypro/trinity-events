import React from 'react'

const SignUp = (props) => (
  <div className="card">
    <h1>Sign up Form</h1>
    <form action="api/studentSignUp" method="post" className="form">
      <div style={{display: "flex", width:"100%"}}>
      <input required placeholder="First Name"  type="text"  name="firstName" style={{width: "48%"}}/>
      <input required placeholder="Last Name"  type="text"  name="lastName" style={{width: "48%"}}/>
      </div>
      <input required placeholder="Email (Preferably @tcd.ie)" type="email" name="email"/>
      <input required placeholder="Student ID" type="text"  name="studentID"/>
      <input type="submit" value="Submit" className="button"/>
    </form>  
  </div>
)

export default SignUp