import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Purchase from "./pages/purchase";
import Product from "./pages/product";
import FairMarketValue from './pages/fair-market-value';
import Vendor from './pages/vendor';

/*export class Application extends React.Component{
    render(){
        return(
            <Router>
                <Switch>
                    <Route path="/" element={<Purchase />}/>
                    <Route path="/product" element={<Product />} />
                    <Route path="/fair-market-value" element={<FairMarketValue />} />
                    <Route path="/vendor" element={<Vendor />}/>
                </Switch>
            </Router>
        );
    }
}

ReactDOM.render(<Application />, document.getElementById("root"));*/

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();


