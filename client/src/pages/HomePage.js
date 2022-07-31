// Page used to display the home page of the application
import React from "react";
import { pages } from "../components/MenuBar";
import { Row } from "react-bootstrap";
import styled from "styled-components";
import Fade from "react-reveal/Fade";
import Pulse from 'react-reveal/Pulse';

import logo from "../assets/colorlogo.png";

import Lottie from 'react-lottie';
import animationData from '../assets/lotties/lf20_jvsg7n5g'

const Logo = styled.img`
  width: min(25%, 160px);
  height: auto;
  display: block;
  margin-left: auto;
  margin-right: auto;
  margin-top: 12vh;
  @media(max-width: 768px) {
    margin-top: 10vh;
  }
`

const NavLink = styled.a`
  font-family: Poppins;
  font-weight: 600;
  font-size: 25px;
  text-transform: uppercase;
  color: var(--c-accent-blue) !important;
  text-decoration: none !important;
  transition: ease-in-out 0.5s;
  margin: 10px 25px 10px 25px;
  &:hover {
    text-decoration: underline !important;
    // @media(min-width: 768px) {
    //   font-size: 27px;
    // }
    // @media(max-width: 768px) {
    //   font-size: 31px;
    // }
  }
  @media(max-width: 768px) {
    margin: 10px 16px 10px 16px;
    font-size: 29px;
  }
`;

const NavWrapper = styled(Row)`
  margin-top: 55px;
  width: min(80%, 1000px);
  height: 100px;
  z-index: 1000;
  @media(max-width: 768px) {
    width: 90%;
  }
`;

const HomePage = () => {
  // Displays the visuals and links on the home page of the application
  return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative'}}>
        <Fade top cascade>
          <Logo src={logo}/>
          <h2 style={{ marginTop: '15px', fontFamily: 'Poppins', fontWeight: '600', fontSize: 38 }}>MySongsQL</h2>
        </Fade>
        <NavWrapper className="justify-content-center">
          {pages.map((page, i) => (
            <div class="d-flex justify-content-around">
              <Fade delay={700 + 300 * i} duration={700}>
                <Pulse delay={1500 + 300 * i}>
                  <NavLink href={page.path} id="navlink">
                    {page.name}
                  </NavLink>
                </Pulse>
              </Fade>
            </div>
          ))}
        </NavWrapper>
          <Lottie 
            isClickToPauseDisabled
            options={{
              speed: 0.7,
              loop: true,
              autoplay: true,
              animationData: animationData,
              rendererSettings: {
                preserveAspectRatio: "xMidYMid slice"
            }}}
            height={600}
            width={'100vw'}
          />
        <div style={{ position: 'absolute', bottom: 40, width: '75%',}}>
          <Fade delay={4000}>
            <p style={{ textAlign: 'center', color: 'var(--c-text-muted)', fontSize: 11 }}>Made by Irwin Deng, David Feng, Ryoma Harris, and Raunaq Singh</p>
          </Fade>
        </div>
      </div>
  );
}

export default HomePage;
