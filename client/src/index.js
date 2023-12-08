import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import Dashboard from './Dashboard';
import UserAddInfo from './UserAddInfo';
import { BrowserRouter as Router, Route, Routes, Navigate, BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Router>
        <Routes>
            <Route path='/' element={<App />}/>
            <Route path='/Dashboard' element={<Dashboard />}/>
            <Route path='/UserAddInfo' element={<UserAddInfo />}/>
        </Routes>
    </Router>
);



