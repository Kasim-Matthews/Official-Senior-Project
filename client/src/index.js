import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Distribution from './Distribution';

export class Application extends React.Component{
    render(){
        return(
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<App />}/>
                    <Route path="/distribution" element={<Distribution />} />
                </Routes>
            </BrowserRouter>
        );
    }
}

ReactDOM.render(<Application />, document.getElementById("root"));


