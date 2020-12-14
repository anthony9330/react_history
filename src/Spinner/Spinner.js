import logo from "../logo.svg";
import './Spinner.css'
import React from 'react';

const spinner = () => (
    <header className="Spinner-header">
        <img src={logo} className="Spinner-logo" alt="logo"/>
    </header>
);

export default spinner;
