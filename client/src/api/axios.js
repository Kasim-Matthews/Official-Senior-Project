import axios from "axios";


export default axios.create({
    baseURL: process.env.BASE_URL,
    withCredentials: true
})
export const axiosPrivate = axios.create({
    baseURL: process.env.BASE_URL,
    headers: {'Content-Type': 'application/json'},
    withCredentials: true
})