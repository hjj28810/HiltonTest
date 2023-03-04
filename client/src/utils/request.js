import axios from "axios";
// eslint-disable-next-line no-unused-vars
import { Message } from "element-ui";
import { getUUID } from "./index";
import router from '@/router'
var cryptoJS = require("crypto-js");
// create an axios instance
const service = axios.create({
    baseURL: "http://127.0.0.1:8081/api/v1", // url = base url + request url
    // withCredentials: true, // send cookies when cross-domain requests
    timeout: 58000 // request timeout
});

// request interceptor
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

// response interceptor
service.interceptors.response.use(
    response => {
        const res = response.data;
        if (res.code >= 200 && res.code < 300) { return res.data; }

        if (res.code >= 400) {
            if (res.code === 401) {
                router.go(-1)
            }

            Message({
                message: res.message || "Error",
                type: "error",
                duration: 5 * 1000
            });

            return Promise.reject(new Error(res.message || "Request Error"));
        }
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
