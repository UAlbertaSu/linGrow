import { useState } from 'react';
import './Signup.css';
import 'react-bootstrap/Form'
import Container from 'react-bootstrap/Container'
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
                <h1>Welcome to linGrow {name}!</h1>
            </div>
        );
    };

    // Showing error message if error is true
    const errorMessage = () => {
        return (
            <div class="container">
                <div class="center"></div>
                    <div className="error" style={{
                    display: error ? '' : 'none',
                    }}>
                    <h1>User Registration</h1>
                    Please enter all the fields
                    </div>
                </div>
        );
    };

    return (
        <Container>
            <div class="container">
                <div class="center">
                    <div className="form">
                        <div className="messages">
                            <h1>User Registration</h1>
                        </div>

                        {/* Calling to the methods */}
                        <div className="messages">
                            {errorMessage()}
                            {successMessage()}
                        </div>
                        <form classname='input'>
                            <div class="form-group">
                                {/* Labels and inputs for form data */}
                                <label className="label">Name</label>
                                <input type="text" class="form-control" id="name" placeholder="Enter name" value={name} onChange={handleName} />
                                <label className="label">Password</label>
                                <input type="password" class="form-control" id="password" placeholder="Enter password" value={password} onChange={handlePassword} />
                            </div>
                            <Button variant="primary" type="submit" onClick={handleSubmit}>Submit</Button>
                        </form>
                    </div>
                </div>
            </div>
      </Container>
            
    );
}