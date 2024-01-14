import React, { useState, useEffect } from "react";
import Partner from "../Partner";
import Axios from 'axios';
import {useNavigate} from "react-router-dom";

function PartnerController(){
    const navigate = useNavigate();



    function handleRemove(id){
        Axios.delete(`http://localhost:3001/partner/remove/${id}`);
    }

    function handleEdit(id){
        navigate(`/partner/${id}/edit`)
    }

    function handleView(id){
        navigate(`/partner/${id}`)
      }
    

    return(
        <Partner
        handleRemove={handleRemove}
        handleEdit={handleEdit}
        handleView={handleView}
        />
    );
}

export default PartnerController;