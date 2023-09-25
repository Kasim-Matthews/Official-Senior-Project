import Distribution from '../Model/Distribution';
import Axios from 'axios';

let distributionForm = document.getElementById("distribution");

distributionForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let currentDate = new Date();
    


    let partner = document.getElementById("partner");
    let date = document.getElementById("date");
    let source = document.getElementById("source");
    let totalitems = document.getElementById("total-items");
    let value = document.getElementById("value");
    let deliverymethod = document.querySelector('input[name="delivery-method"]:checked').value;
    let comments = document.getElementById("comments");
    let state = givenDate.getTime() < currentDate.getTime();
    let givenDate = new Date(date);

    let add = new Distribution(partner, date, source, totalitems, value, deliverymethod, comments);
    Axios.post("http://localhost:3001/api/insert", {partner:add.partner, date:add.date, source:add.source, totalitems: add.quantity, value: add.value, deliverymethod: add.deliverymethod, comments: add.comments, state: add.state})
});