import axios from "axios";
import { getUUID } from "./index";
var cryptoJS = require("crypto-js");
import router from '@/router'
// create an axios instance
const service = axios.create({
    baseURL: "http://127.0.0.1:8081/graphql?", // url = base url + request url
    // withCredentials: true, // send cookies when cross-domain requests
    timeout: 58000, // request timeout
    method: "post"
});

service.interceptors.request.use(
    config => {
        // do something before request is sent
        var nonce = getUUID();
        var curTime = Math.floor(new Date().getTime() / 1000);

        config.headers["Nonce"] = nonce;
        config.headers["Content-Type"] = "application/json";
        config.headers["CurTime"] = curTime;
        config.headers["CheckSum"] = cryptoJS
            .SHA1(`6f2ad63f0ef2${nonce}${curTime}`)
            .toString(cryptoJS.enc.Hex);
        config.headers["Authorization"] = localStorage.getItem('token')

        return config;
    },
    error => {
        // do something with request error
        console.log(error); // for debug
        return Promise.reject(error);
    }
);

service.interceptors.response.use(
    response => {
        if (response.status === 200) {
            if (response.data.code === 401) {
                router.go(-1)
                return
            }
            // if (response.data.errors) {
            //     Message({
            //         message: response.data.errors || "Error",
            //         type: "error",
            //         duration: 5 * 1000
            //     });

            //     return Promise.reject(new Error(response.data.errors || "GraphQL Error"));
            // }
            return response.data.data;
        }
        else
            return Promise.reject(new Error("GraphQL Error"));
    },
    error => {
        console.log("err" + error); // for debug
        Message({
            message: error.message,
            type: "error",
            duration: 5 * 1000
        });
        return Promise.reject(error);
    }
);
export default service;
