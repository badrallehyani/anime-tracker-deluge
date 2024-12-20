import './App.css';
import fetch from 'cross-fetch';

import React, { useState } from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    useLocation
} from "react-router-dom";

import Nav from './routes/Nav'

// Routes Import
import Edit from './routes/Edit';
import Recent from './routes/Recent';
import Add from './routes/Add';
import NextRefresh from './routes/NextRefresh';
import LogsRouter from './routes/LogsRouter';

function App() {
    const navLinks = [
        {
            name: "Add",
            href: "/add",
            component: Add
        },
        {
            name: "Edit",
            href: "/edit",
            component: Edit
        },
        {
            name: "Recent",
            href: "/recent",
            component: Recent
        },
        {
            name: "Next Refresh",
            href: "/next_refresh",
            component: NextRefresh
        },
        {
            name: "Logs",
            href: "/logs",
            component: LogsRouter
        }
    ]

    return (
        <Router>
            <div className="App">
                <Nav links={navLinks}/>
                <Routes>
                    <Route path='/' Component={Edit} exact></Route>
                    {
                        navLinks.map( (link)=>
                            <Route path={link.href} Component={link.component} exact></Route>
                        )
                    }
                </Routes>
            </div>

            <div style={{marginTop: "100px"}}>
                {window.screen.availWidth} X {window.screen.availHeight}
            </div>
        </Router>
    );
}

export default App;
