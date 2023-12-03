import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Purchase from "./purchase";
import Product from "./product";
import FairMarketValue from './fair-market-value';
import Vendor from './vendor';

const root = ReactDOM.createRoot(document.getElementById('root'));

export class Application extends React.Component{
    render(){
        return(
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Purchase/>} />
                    <Route path="/product" element={<Product/>}/>
                    <Route path='/fair-market-value' element={<FairMarketValue/>}/>
                    <Route path="/vendor" element={<Vendor/>}/>
                </Routes>
            </BrowserRouter>
        );
    }
}

root.render(<Application />)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();


