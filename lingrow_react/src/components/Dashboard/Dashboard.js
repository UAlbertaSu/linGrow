import React from 'react';
import { useNavigate } from "react-router-dom";
import './Dashboard.css';
import logo from '../Img/lingrow.png';
import { Button, Card } from 'react-bootstrap';

export default function Dashboard() {
    const nav = useNavigate();

    const clearSession = async (event) => {
        sessionStorage.clear();
        nav("/");
    }

    return (
        <div className="dashboard-wrapper">
            <Card>
                <h2>Welcome to LinGrow dashboard</h2>
                <button onClick={clearSession}>Logout</button>
                <a href="https://drive.google.com/drive/folders/1h4pmfp66la3ZBpEIwcfHb7TEY5QbUgOj">Kitchen Activities</a>
                <a href="https://drive.google.com/drive/folders/1Pbaax2cLWvOSO8sY2Lm8by0lE0G8njRJ">Bath Time!</a>
            </Card>
        </div>
    );
}