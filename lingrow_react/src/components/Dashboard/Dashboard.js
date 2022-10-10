import React from 'react';
import { useNavigate } from "react-router-dom";
import './Dashboard.css';
import logo from '../Img/lingrow.png';

export default function Dashboard() {
    const nav = useNavigate();

    const clearSession = async (event) => {
        sessionStorage.clear();
        nav("/");
    }

    return (
        <div className="dashboard-wrapper">
            <img src={logo} className="logo" alt="logo" />
            <h2>Welcome to linGrow dashboard</h2>
            <button onClick={clearSession}>Logout</button>
        </div>
    );
}