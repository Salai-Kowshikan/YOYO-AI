import axios from "axios";

const api = axios.create({
    baseURL: "http://10.11.148.18:11434/api"
})

export default api;