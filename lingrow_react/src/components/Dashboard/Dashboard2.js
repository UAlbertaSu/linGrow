import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import './Dashboard.css';
import { Card } from 'react-bootstrap';

export default function Dashboard() {
    const nav = useNavigate();

    useEffect(() => {
        if (sessionStorage.getItem('token') === null || sessionStorage.getItem('token').includes("error")) {
            nav("/");
        }
    }, []);

    const clearSession = async (event) => {
        sessionStorage.clear();
        sessionStorage.setItem('redirect', "success");
        nav("/");
    }

    const teacher_dashboard = () => {
        // ...
    }

    const parent_dashboard = () => {
        // ...
    }

    return (
        <div className="dashboard-wrapper">
            <Card>
                <h2>Welcome to LinGrow dashboard</h2>
                <div>
                    {teacher_dashboard()}
                    {parent_dashboard()}
                </div>
                <button onClick={clearSession} data-testid='logout'>Logout</button>
                <a href="https://drive.google.com/drive/folders/1h4pmfp66la3ZBpEIwcfHb7TEY5QbUgOj">Kitchen Activities</a>
                <a href="https://drive.google.com/drive/folders/1Pbaax2cLWvOSO8sY2Lm8by0lE0G8njRJ">Bath Time!</a>
            </Card>
        </div>
    );
}