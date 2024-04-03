import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
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
import ViewIntake from './OneIntake'
import EditIntake from './EditIntake';
import AddPurchase from './AddPurchase';
import PDFView from './PDFView';
import VendorView from './VendorView';
import AddVendor from './AddVendor';
import EditVendor from './EditVendor';
import Purchase from './PurchaseView';
import ViewVendor from './OneVendor';
import ViewPurchase from './OnePurchase';
import EditPurchase from './EditPurchase';
import AddDrive from './AddDrive';
import EditDrive from './EditDrive';
import DonationSiteView from './DonationSiteView';
import AddDonationSite from './AddDonationSite';
import EditDonationSite from './EditDonationSite';
import ViewDonationSite from './OneDonationSite';
import ViewDrive from './OneDrive';
import AddTransfer from './AddTransfer';
import TransferView from './TransferView';
import ViewTransfer from './OneTransfer';
import ViewManufacturer from './OneManufacturer';
import ProductDriveView from './ProductDriveView';
import AddAudit from './AddAudit';
import AuditView from './AuditView';
import ViewAudit from './OneAudit';
import ViewLocation from './OneLocation';

export class Application extends React.Component {
    render() {
        return (
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<App />} />
                    <Route path="/Dashboard" element={<Dashboard />} />

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
                    <Route path="/location/:id" element={<ViewLocation />} />

                    <Route path='/manufacturers' element={<Manufacturers />} />
                    <Route path='/manufacturers/:id/edit' element={<EditManufacturers />} />
                    <Route path='/manufacturers/new' element={<AddManufacturers />} />
                    <Route path='/manufacturers/:id' element={<ViewManufacturer />} />

                    <Route path="/intake" element={<Intake />} />
                    <Route path="/intake/new" element={<AddIntake />} />
                    <Route path='/intake/:id/edit' element={<EditIntake/>}/>
                    <Route path="/intake/:id" element={<ViewIntake />} />
                    
                    <Route path="/purchase" element={<Purchase/>}/>
                    <Route path="/purchase/new" element={<AddPurchase/>}/>
                    <Route path="/purchase/:id" element={<ViewPurchase />} />
                    <Route path="/purchase/:id/edit" element={<EditPurchase />} />

                    <Route path='/vendor' element={<VendorView/>}/>
                    <Route path='/vendor/new' element={<AddVendor/>}/>
                    <Route path='/vendor/:id/edit' element={<EditVendor/>}/>
                    <Route path='/vendor/:id' element={<ViewVendor/>}/>

                    <Route path='/productdrive' element={<ProductDriveView/>}/>
                    <Route path='/productdrive/new' element={<AddDrive/>}/>
                    <Route path='/productdrive/:id/edit' element={<EditDrive/>}/>
                    <Route path='/productdrive/:id' element={<ViewDrive/>}/>

                    <Route path='/donationsite' element={<DonationSiteView/>}/>
                    <Route path='/donationsite/new' element={<AddDonationSite/>}/>
                    <Route path='/donationsite/:id/edit' element={<EditDonationSite/>}/>
                    <Route path='/donationsite/:id' element={<ViewDonationSite/>}/>

                    <Route path='/transfer' element={<TransferView/>}/>
                    <Route path='/transfer/new' element={<AddTransfer/>}/>
                    <Route path='/transfer/:id' element={<ViewTransfer/>}/>

                    <Route path='/audit' element={<AuditView/>}/>
                    <Route path='/audit/new' element={<AddAudit/>}/>
                    <Route path='/audit/:id' element={<ViewAudit />}/>



                </Routes>
            </BrowserRouter>
        );
    }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Application />
);


