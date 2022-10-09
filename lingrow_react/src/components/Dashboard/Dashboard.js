import React from 'react';
import './Dashboard.css';
import logo from '../Img/lingrow.png';

export default function Dashboard() {
    return (
        <div className="dashboard-wrapper">
            <img src={logo} className="logo" alt="logo" />
            <h2>Welcome to linGrow dashboard</h2>
        </div>
    );
}