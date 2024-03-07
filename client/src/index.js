import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Order from './Order';
import AddOrder from './AddOrder';
import AddPartner from './AddPartner';
import PartnerView from './PartnerView';
import ItemView from './ItemView';
import AddItem from './AddItem';
import EditOrder from './EditOrder';
import ViewOrder from './OneOrder';
import EditItem from './EditItem';
import EditPartner from './EditPartner';
import ViewItem from './OneItem';
import ViewPartner from './OnePartner';
import AddLocation from './AddLocation';
import LocationView from './LocationView';
import EditLocation from './EditLocation';
import Manufacturers from './Manufacturers';
import AddManufacturers from './AddManufacturers';
import EditManufacturers from './EditManufacturers';
import Dashboard from './Dashboard';
import AddIntake from "./AddIntake";
import Intake from './Intake';
import ViewIntake from './OneIntake';
import UserAddInfo from './UserAddInfo';
import Login from './login';
import Register from './register';
import EditIntake from './EditIntake';
import AddPurchase from './AddPurchase';
import PDFView from './PDFView';


export class Application extends React.Component {
    render() {
        return (
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/Dashboard" element={<Dashboard />} />
                    <Route path='/UserAddInfo' element={<UserAddInfo />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/register' element={<Register />} />
                    
                    <Route path="/distribution" element={<Order />} />
                    <Route path='/distribution/:id' element={<ViewOrder />} />
                    <Route path='/distribution/:id/edit' element={<EditOrder />} />
                    <Route path="/distribution/new" element={<AddOrder />} />
                    <Route path='/distribution/:id/print.pdf' element={<PDFView />}/>

                    <Route path="/partner/new" element={<AddPartner />} />
                    <Route path='/partner/:id/edit' element={<EditPartner />} />
                    <Route path='/partner/:id' element={<ViewPartner />} />
                    <Route path="/partner" element={<PartnerView />} />

                    <Route path='/item' element={<ItemView />} />
                    <Route path='/item/:id' element={<ViewItem />} />
                    <Route path='/item/:id/edit' element={<EditItem />} />
                    <Route path='/item/new' element={<AddItem />} />

                    <Route path='/location' element={<LocationView />} />
                    <Route path='/location/:id/edit' element={<EditLocation />} />
                    <Route path='/location/new' element={<AddLocation />} />

                    <Route path='/manufacturers' element={<Manufacturers />} />
                    <Route path='/manufacturers/:id/edit' element={<EditManufacturers />} />
                    <Route path='/manufacturers/new' element={<AddManufacturers />} />

                    <Route path="/intake" element={<Intake />} />
                    <Route path="/intake/new" element={<AddIntake />} />
                    <Route path='/intake/:id/edit' element={<EditIntake/>}/>
                    <Route path="/intake/:id" element={<ViewIntake />} />

                    <Route path="/purchase/new" element={<AddPurchase/>}/>



                </Routes>
            </BrowserRouter>
        );
    }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Application />
);


