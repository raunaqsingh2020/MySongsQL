// Menu Bar component that displays at the top of every page of our application
import React from 'react';
import { Navbar, Nav, NavDropdown, Container, Form, FormControl, Button } from 'react-bootstrap';

import { postLogin, postRegister } from '../fetcher'

import sha256 from "js-sha256"

import textlogo from '../assets/textlogo.png'

export const pages = [
  {path: '/songs', name: 'Songs'},
  {path: '/albums', name: 'Albums'},
  {path: '/artists', name: 'Artists'},
  {path: '/charts', name: 'Charts'},
  {path: '/leaderboard', name: 'Leaderboard'},
]

class MenuBar extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      usernameInput: "",
      passwordInput: "",
      isLoggedIn: (localStorage.getItem("isLoggedIn") === "true"),
      loggedInUser: localStorage.getItem("loggedInUser")
    }

    this.handleUsernameChange = this.handleUsernameChange.bind(this)
    this.handlePasswordChange = this.handlePasswordChange.bind(this)
    this.login = this.login.bind(this)
    this.register = this.register.bind(this)
    this.logout = this.logout.bind(this)
  }

  handleLoginChange(isLoggedInValue, loggedInUserValue) {
    this.setState({ isLoggedIn: isLoggedInValue, loggedInUser: loggedInUserValue })
    if (this.props.onLoginChange !== undefined) {
      this.props.onLoginChange(isLoggedInValue, loggedInUserValue)
    }
    localStorage.setItem("isLoggedIn", isLoggedInValue)
    localStorage.setItem("loggedInUser", loggedInUserValue)
  }

  handleUsernameChange(event) {
    this.setState({ usernameInput: event.target.value })
  }

  handlePasswordChange(event) {
    this.setState({ passwordInput: event.target.value })
  }

  // Handles attempted login by the user, validating inputs for username and password
  login(event) {
    if (this.state.usernameInput.includes("'") || this.state.usernameInput.includes("&")) {
      window.alert("Invalid username, can not contain the following characters: ' or &")
      return
    }
    if (this.state.passwordInput.includes("'") || this.state.passwordInput.includes("&")) {
      window.alert("Invalid password, can not contain the following characters: ' or &")
      return
    }
    if (this.state.usernameInput.length === 0 || this.state.usernameInput.length > 255) {
      window.alert("Invalid username, length must be between 1 and 255")
      return
    }

    // Hashes password using SHA256 for increased security
    const hashedPassword = sha256(sha256(this.state.passwordInput + "this_is_a_salt"))

    postLogin(this.state.usernameInput, hashedPassword).then(res => {
      this.setState({ usernameInput: "", passwordInput: ""})
      this.handleLoginChange(res.successful, res.loggedInUser)

      if (!res.successful) {
        window.alert(res.error)
      }
    })
  }

  register(event) {
    if (this.state.usernameInput.includes("'") || this.state.usernameInput.includes("&")) {
      window.alert("Invalid username, can not contain the following characters: ' or &")
      return
    }
    if (this.state.passwordInput.includes("'") || this.state.passwordInput.includes("&")) {
      window.alert("Invalid password, can not contain the following characters: ' or &")
      return
    }
    if (this.state.usernameInput.length === 0 || this.state.usernameInput.length > 255) {
      window.alert("Invalid username, length must be between 1 and 255")
      return
    }

    const hashedPassword = sha256(sha256(this.state.passwordInput + "this_is_a_salt"))

    postRegister(this.state.usernameInput, hashedPassword).then(res => {
      console.log(res);

      this.setState({ usernameInput: "", passwordInput: ""})
      this.handleLoginChange(res.successful, res.loggedInUser)

      if (!res.successful) {
        window.alert(res.error)
      }
    })
  }

  // Handles user logout
  logout(event) {
    this.setState({ usernameInput: "", passwordInput: ""})
    this.handleLoginChange(false, null)
  }
  
  render() {
    return(
      <Navbar bg="dark" variant="dark" expand="lg" sticky="top" style={{ boxShadow: '0 0 30px gray' }}>
        <Container>
        <Navbar.Brand href="/">
          <img
            src={textlogo}
            height="30"
            className="d-inline-block align-top"
            alt="logo"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        {/* Displays each of the links to the pages in our application */}
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {pages.map((page) => (
              <Nav.Link href={page.path}>{page.name}</Nav.Link>
            ))}
          </Nav>
          {/* Displays dropdown for logout and account handling */}
          <Nav>
            <NavDropdown title="Account" id="basic-nav-dropdown" variant="light" style={{ right: 20 }}>
              {this.state.isLoggedIn ? 
                <>
                  <div style={{ padding: '0px 8px 0px 8px' }}>
                  <Navbar.Text style={{ color: 'black', fontSize: '14px' }}> Welcome, {this.state.loggedInUser}!</Navbar.Text>
                  </div>
                  <NavDropdown.Divider />
                  <Nav.Link style={{ color: 'black', padding: '0px 8px 0px 8px', fontSize: '14px' }} href={'/favorites'}>{'My Favorites'}</Nav.Link>
                  <Nav.Link style={{ color: 'black', padding: '0px 8px 0px 8px', fontSize: '14px' }} href={'/'} onClick={this.logout}>Log out</Nav.Link>
                </>
                :
                <>
                  <Form className="d">
                    <div style={{ padding: 10 }}>
                      <FormControl
                        type="search"
                        placeholder="Username"
                        className="me-2"
                        aria-label="Username"
                        style={{ marginBottom: 5 }}
                        value={this.state.usernameInput}
                        onChange={this.handleUsernameChange}
                      />
                      <FormControl
                        type="password"
                        placeholder="Password"
                        className="me-2"
                        aria-label="Password"
                        value={this.state.passwordInput}
                        onChange={this.handlePasswordChange}
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', padding: '5px 10px 5px 10px' }}>
                      <Button style={{ marginBottom: 5 }} size="sm" variant="outline-secondary" onClick={this.login}>Login</Button>
                      <Button size="sm" variant="outline-secondary" onClick={this.register}>Register</Button>
                    </div>
                  </Form>
                </>
              }
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
        </Container>
      </Navbar>
    )
  }
}

export default MenuBar
