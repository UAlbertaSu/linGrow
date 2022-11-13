import React from 'react';
import './Dashboard.css';

import DashboardAdmin from './DashboardAdmin';
import DashboardParent from './DashboardParent';
import DashboardTeacher from './DashboardTeacher';
import DashboardResearcher from './DashboardResearcher';

export default function Dashboard() {
    let userType = parseInt(sessionStorage.getItem('userType'));

    // navigate based on appropriate user type
    switch(userType) {
        case 1:
            return (<div><DashboardParent /></div>);
        case 2:
            return (<div><DashboardTeacher /></div>);
        case 3:
            return (<div><DashboardResearcher /></div>);
        case 4:
            return (<div><DashboardAdmin /></div>);
    }
}