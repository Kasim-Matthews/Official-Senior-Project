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
import EditDistribution from './EditDistribution';
import ViewDistribution from './OneDistribution';
import EditItem from './EditItem';
import EditPartner from './EditPartner';
import ViewItem from './OneItem';
import ViewPartner from './OnePartner';
import AddLocation from './AddLocation';
import Location from './Location';
import EditLocation from './EditLocation';
import Manufacturers from './Manufacturers';
import AddManufacturers from './AddManufacturers';
import EditManufacturers from './EditManufacturers';
import Dashboard from './Dashboard';
import AddIntake from "./purchase";


export class Application extends React.Component{
    render(){
        return(
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<App />}/>
                    <Route path="/Dashboard" element={<Dashboard />}/>

                    <Route path="/distribution" element={<Distribution />} />
                    <Route path='/distribution/:id' element={<ViewDistribution/>}/>
                    <Route path='/distribution/:id/edit' element={<EditDistribution/>}/>
                    <Route path="/distribution/new" element={<AddDistribution />} />

                    <Route path="/partner/new" element={<AddPartner />}/>
                    <Route path='/partner/:id/edit' element={<EditPartner/>}/>
                    <Route path='/partner/:id' element={<ViewPartner/>}/>
                    <Route path="/partner" element={<Partner />}/>

                    <Route path='/item' element={<Item/>}/>
                    <Route path='/item/:id' element={<ViewItem/>}/>
                    <Route path='/item/:id/edit' element={<EditItem/>}/>
                    <Route path='/item/new' element={<AddItem/>}/>

                    <Route path='/location' element={<Location/>}/>
                    <Route path='/location/:id/edit' element={<EditLocation/>}/>
                    <Route path='/location/new' element={<AddLocation/>}/>

                    <Route path='/manufacturers' element={<Manufacturers/>}/>
                    <Route path='/manufacturers/:id/edit' element={<EditManufacturers/>}/>
                    <Route path='/manufacturers/new' element={<AddManufacturers/>}/>

                    <Route path="/intake" element={<AddIntake/>} />

                </Routes>
            </BrowserRouter>
        );
    }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Application />
);


