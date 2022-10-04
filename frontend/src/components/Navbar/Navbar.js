import React, { useState } from "react";
import { AuthContext } from "../../App";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { Link as RouterLink } from "react-router-dom";
import Link from "@material-ui/core/Link";
import "./Navbar.css";

function Navbar() {
  const { auth, setAuth } = React.useContext(AuthContext);

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("userType");
    localStorage.removeItem("token");
    setAuth({
      loggedIn: false,
      token: {},
      user: {},
      userType: "",
    });
    window.location = "/";
  };

  if (auth.loggedIn && auth.userType === "Recruiter") {
    return (
      <AppBar position="static"   
      style={{
        backgroundColor: "transparent",
      }}>
        <Toolbar className="Navbar">
          <h1 style={{ flexGrow: 1, color:'black' }}>Alpha<span style={{ color:'rgb(236, 43, 43)' }}>Job</span></h1>
          <Link component={RouterLink} to="/">
            <Button
              variant="contained"
              style={{
                color: "white",
                backgroundColor: "rgb(236, 43, 43)",
                marginRight: 10,
              }}
            >
             Ajouter
            </Button>
          </Link>
          <Link component={RouterLink} to="/mylistings">
            <Button
              variant="contained"
              style={{
                color: "white",
                backgroundColor: "rgb(236, 43, 43)",
                marginRight: 10,
              }}
            >
              Liste
            </Button>
          </Link>
          <Link component={RouterLink} to="/acceptedemployees">
            <Button
              variant="contained"
              style={{
                color: "white",
                backgroundColor: "rgb(236, 43, 43)",
                marginRight: 10,
              }}
            >
              Accepté(e)
            </Button>
          </Link>
          <Link component={RouterLink} to="/profile">
            <Button
              variant="contained"
              color="primary"
              style={{
                marginRight: 10,
                backgroundColor: "black",
              }}
            >
             Mon profil
            </Button>
          </Link>
          <Button 
            style={{
              color: "white",
              backgroundColor: "black",
              marginRight: 10,
            }}
          color="secondary" variant="contained" onClick={logout}>
          Déconnexion
          </Button>
        </Toolbar>
      </AppBar>
    );
  } else if (auth.loggedIn && auth.userType === "Applicant") {
    return (
      <AppBar position="static"   
      style={{
        backgroundColor: "transparent",
      }}>
        <Toolbar className="Navbar">
        <h1 style={{ flexGrow: 1, color:'black' }}>Alpha<span style={{ color:'rgb(236, 43, 43)' }}>Job</span></h1>
          <Link component={RouterLink} to="/">
            <Button
              variant="contained"
              style={{
                color: "white",
                backgroundColor: "rgb(236, 43, 43)",
                marginRight: 10,
              }}
            >
              Rechercher
            </Button>
          </Link>
          <Link component={RouterLink} to="/myapplications">
            <Button
              variant="contained"
              style={{
                color: "white",
                backgroundColor: "rgb(236, 43, 43)",
                marginRight: 10,
              }}
            >
              Mes candidatures
            </Button>
          </Link>
          <Link component={RouterLink} to="/profile">
            <Button
              variant="contained"
              color="white"
              style={{
                marginRight: 10,
           
              }}
            >
              Mon profil
            </Button>
          </Link>
          <Button 
            style={{
              color: "white",
              backgroundColor: "black",
              marginRight: 10,
            }}
          color="secondary" variant="contained" onClick={logout}>
            Déconnexion
          </Button>
        </Toolbar>
      </AppBar>
    );
  } else if (!auth.loggedIn && !auth.userType) {
    return (
    <AppBar position="static"   
    style={{
      backgroundColor: "transparent",
    }}>
      <Toolbar className="Navbar">
      <h1 style={{ flexGrow: 1, color:'black' }}>Alpha<span style={{ color:'rgb(236, 43, 43)' }}>Job</span></h1>
        <Link component={RouterLink} to="/login">
        <Button 
          style={{
            color: "white",
            backgroundColor: "black",
            marginRight: 10,
          }}
        color="secondary" variant="contained" >
          S'inscrire
        </Button>
        </Link>
      </Toolbar>
    </AppBar>
  );
}
}

export default Navbar;
