import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import styled from 'styled-components';
import * as Papa from 'papaparse';
import { CSVLink, CSVDownload } from 'react-csv';
import { resolvePath } from 'react-router-dom';

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

// Given list of new users, mass-add users into the database.
async function handleNewUsers(users) {
    let token = JSON.parse(sessionStorage.getItem('token'));

    let request = {
        "users": users
    }

    console.log(JSON.stringify(request));

    return fetch('http://[2605:fd00:4:1001:f816:3eff:fe76:4a8a]/api/user/admin-add-users/', {
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

// Given school name, retrieve school ID.
async function retrieveSchoolID(schoolName) {
    let token = JSON.parse(sessionStorage.getItem('token'));

    if (schoolName === "") {
        return "";
    }

    return fetch(`http://[2605:fd00:4:1001:f816:3eff:fe76:4a8a]/api/school/`, {
        method: 'GET',
        headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }).then(data => data.json()
    ).then(data => {
        let schoolID = data.filter(school => school.name === schoolName);

        if (schoolID.length === 0) {
            return schoolName;
        }
        else {
            return schoolID[0].id;
        }
    }).catch(error => {
        console.log(error);
    });
}

// Given school ID and classroom name, retrieve the classroom ID.
async function retrieveClassroomID(schoolID, classroomName) {
    let token = JSON.parse(sessionStorage.getItem('token'));

    if (schoolID === "" || classroomName === "") {
        return "";
    }

    return fetch(`http://[2605:fd00:4:1001:f816:3eff:fe76:4a8a]/api/school/${schoolID}/classroom/`, {
        method: 'GET',
        headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }).then(data => data.json()
    ).then(data => {
        let classroomID = data.filter(classroom => classroom.name === classroomName);

        if (classroomID.length === 0) { 
            return classroomName;
        }
        else {
            return classroomID[0].id;
        }
    }).catch(error => {
        console.log(error);
    });
}

// Parse the user_type header of .csv file, return int value for each user types.
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

    // Once a valid file has been dropped to the dropbox (or added by user), parse that file and calls admin-add-user API.
    const onDrop = useCallback(acceptedFiles => {
        const reader = new FileReader();

        if (acceptedFiles.length === 0) {
            alert('Please upload a .csv file.');
            return;
        }

        // Start reading file.
        reader.onabort = () => console.log("file reading was aborted");
        reader.onerror = () => console.log("file reading failed");
        reader.onload = () => {
            const binaryStr = reader.result;

            // Parse the .csv file.
            Papa.parse(binaryStr, {
                header: true,
                complete: function(results) {

                    // Make sure there are total seven fields present as header.
                    if (results.meta.fields.length !== 7) {
                        alert('Please make sure the file has seven fields total as outlined in example output file.');
                        return;
                    }

                    let users = [];

                    // Create promise, and asynchronously retrieve all user details.
                    var promise = new Promise((resolve, reject) => {
                        results.data.forEach(async function(row) {
                            if (row[Object.keys(row)[0]] === "") {
                                return;
                            }

                            let userType = enumUserType(row[Object.keys(row)[4]]);

                            if (userType === 2) {
                                let schoolID = await retrieveSchoolID(row[Object.keys(row)[5]]);
                                let classroomID = await retrieveClassroomID(schoolID, row[Object.keys(row)[6]]);

                                users.push({
                                    "email": row[Object.keys(row)[0]],
                                    "first_name": row[Object.keys(row)[1]],
                                    "middle_name": row[Object.keys(row)[2]],
                                    "last_name": row[Object.keys(row)[3]],
                                    "user_type": enumUserType(row[Object.keys(row)[4]]),
                                    "school": schoolID,
                                    "classrooms": [classroomID]
                                });
                            }
                            else {
                                users.push({
                                    "email": row[Object.keys(row)[0]],
                                    "first_name": row[Object.keys(row)[1]],
                                    "middle_name": row[Object.keys(row)[2]],
                                    "last_name": row[Object.keys(row)[3]],
                                    "user_type": enumUserType(row[Object.keys(row)[4]])
                                });
                            }

                            // Once all rows of the .csv files have been processed, resolve the promise.
                            if (results.data.indexOf(row) === results.data.length - 1) {
                                resolve();
                            }
                        });
                    });

                    // Add the users to the database.
                    promise.then(() => {
                        handleNewUsers(users);
                    });
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