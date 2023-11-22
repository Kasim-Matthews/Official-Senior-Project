import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Distribution from './Distribution';
import AddDistribution from './AddDistribution';
import AddPartner from './AddPartner';
import Partner from './Partner';
import Item from './Item';
import AddItem from './AddItem';

export class Application extends React.Component{
    render(){
        return(
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<App />}/>
                    <Route path="/distribution" element={<Distribution />} />
                    <Route path="/distribution/new" element={<AddDistribution />} />
                    <Route path="/partner/new" element={<AddPartner />}/>
                    <Route path="/partner" element={<Partner />}/>
                    <Route path='/item' element={<Item/>}/>
                    <Route path='/item/new' element={<AddItem/>}/>

                </Routes>
            </BrowserRouter>
        );
    }
}

ReactDOM.render(<Application />, document.getElementById("root"));