import { useState } from 'react';
import './Signup.css';
import 'react-bootstrap/Form'
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button'

  export default function Form() {

    // States for registration
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');

    // States for checking the errors
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(false);

    // Handling the name change
    const handleName = (e) => {
        setName(e.target.value);
        setSubmitted(false);
    };

    // Handling the password change
    const handlePassword = (e) => {
        setPassword(e.target.value);
        setSubmitted(false);
    };

    // Handling the form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        if (name === '' || password === '') {
                setError(true);
        } else {
            setSubmitted(true);
            setError(false);
        }
    };

    // Showing success message
    const successMessage = () => {
        return (
            <div className="success" style={{
                display: submitted ? '' : 'none',
            }}>
                Welcome to linGrow {name}!
            </div>
        );
    };

    // Showing error message if error is true
    const errorMessage = () => {
        return (
                <div className="error" style={{
                display: error ? '' : 'none',
                }}>
                    Name and Password required
                </div>
                
        );
    };

    return (
        

                <Card style={{ width: '18rem' }}>
                    <div className="form">
                        <form classname='input'>
                            <div class="form-group">
                            <h1>User Registration</h1>
                                {/* Labels and inputs for form data */}
                            <label className="label">Name</label>
                            <input type="text" class="form-control" id="name" placeholder="Enter name" value={name} onChange={handleName} />
                            <label className="label">Password</label>
                            <input type="password" class="form-control" id="password" placeholder="Enter password" value={password} onChange={handlePassword} />
                            </div>
                            <div className="message">
                                    {errorMessage()}
                                    {successMessage()}
                                </div>
                            <Button variant="outline-primary" type="submit" onClick={handleSubmit}>Submit</Button>
                        </form>
                    </div>
                </Card>
            
    );
}