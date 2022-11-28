import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import styled from 'styled-components';
import * as Papa from 'papaparse';

// Color selection depending on whether a file extension is valid or not.
const getColor = (props) => {
    if (props.isDragAccept) {
        return '#00e676';
    }
    if (props.isDragReject) {
        return '#ff1744';
    }
    if (props.isFocused) {
        return '#2196f3';
    }
    return '#eeeeee';
}

// Style for the dropbox container.
const Container = styled.div`
    display: flex;
    flex-direction: column;
    justifyContent: center;
    alignItems: center;
    padding: 20px;
    border-width: 2px;
    border-radius: 2px;
    border-color: ${props => getColor(props)};
    border-style: dashed;
    background-color: #fafafa;
    color: #bdbdbd;
    outline: none;
    transition: border .24s ease-in-out;
`;

// Removes "BOM" character (ï»¿) from the parsed .csv file.
async function handleNewUsers(users) {
    let token = JSON.parse(sessionStorage.getItem('token'));

    let request = {
        "users": users
    }

    return fetch('http://127.0.0.1:8000/api/user/admin-add-users/', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(request)
    }).then(data => data.json()
    ).then(data => {
        console.log(data);
        if (data.hasOwnProperty("errors")) {
            alert(data.errors.msg);
        }
        else {
            alert(data.msg);
        }
    }).catch(error => {
        console.log(error);
    });
}

function enumUserType(userType) {
    if (userType === "Parent" || userType === "parent") {
        return 1;
    }
    else if (userType === "Teacher" || userType === "teacher") {
        return 2;
    }
    else if (userType === "Researcher" || userType === "researcher") {
        return 3;
    }
    else if (userType === "Admin" || userType === "admin") {
        return 4;
    }
    else {
        return 0;
    }
}

// Dropbox component is defined here.
export default function StyledDropzone({dropbox_message}) {

    // State variable.

    // Once a valid file has been dropped to the dropbox (or added by user), parse that file and calls admin-add-user API.
    const onDrop = useCallback(acceptedFiles => {
        const reader = new FileReader();

        if (acceptedFiles.length === 0) {
            alert('Please upload a .csv file.');
            return;
        }

        reader.onabort = () => console.log("file reading was aborted");
        reader.onerror = () => console.log("file reading failed");
        reader.onload = () => {
            const binaryStr = reader.result;
            Papa.parse(binaryStr, {
                header: true,
                complete: function(results) {
                    // Make sure there are total five fields present
                    if (results.meta.fields.length !== 5) {
                        alert('Please make sure the file has five fields: email, first name, middle name, last name, and user type.');
                        return;
                    }

                    let users = [];
                    
                    results.data.forEach(function(row) {
                        if (row[Object.keys(row)[0]] === "") {
                            return;
                        }

                        let user = {
                            "email": row[Object.keys(row)[0]],
                            "first_name": row[Object.keys(row)[1]],
                            "middle_name": row[Object.keys(row)[2]],
                            "last_name": row[Object.keys(row)[3]],
                            "user_type": enumUserType(row[Object.keys(row)[4]])
                        }
                        users.push(user);
                    });

                    console.log(users);
                    handleNewUsers(users);
                }
            });
        };
    
        acceptedFiles.forEach(file => reader.readAsBinaryString(file));
    }, []);
    
    // Define the dropbox and its components.
    const { 
        isFocused, 
        isDragAccept, 
        isDragReject, 
        getRootProps, 
        getInputProps, 
        isDragActive 
    } = useDropzone({
        accept: {
            'text/csv': ['.csv'],
        },
        onDrop 
    });

    // Return dropbox component for rendering.
    return (
        <div className="container">
            <Container {...getRootProps({isFocused, isDragAccept, isDragReject})} >
                <input id="file_dropbox" {...getInputProps()} />
                <p>{dropbox_message}</p>
            </Container>
        </div>
    );
}