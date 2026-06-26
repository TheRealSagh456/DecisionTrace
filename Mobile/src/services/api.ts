import axios from "axios"
//import Constants from "expo-constants"

//const host = Constants.expoConfig?.hostUri?.split(":")[0];

//const API_URL = `http://${host}:3333`

export const api = axios.create({
    baseURL: "http://10.10.10.137:3333" //"http://10.0.2.2:3333"
})