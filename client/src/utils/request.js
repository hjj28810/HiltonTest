import axios from "axios";
// eslint-disable-next-line no-unused-vars
import { Message } from "element-ui";
import { getUUID } from "./index";
import router from '@/router'
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
        // config.headers["Token"] = getToken();
        var nonce = getUUID();
        var curTime = Math.floor(new Date().getTime() / 1000);
        var cryptoJS = require("crypto-js");
        config.headers["Nonce"] = nonce;
        config.headers["Content-Type"] = "application/json";
        config.headers["CurTime"] = curTime;
        config.headers["CheckSum"] = cryptoJS
            .SHA1(`6f2ad63f0ef2${nonce}${curTime}`)
            .toString(cryptoJS.enc.Hex);
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

        if (res.code >= 200 && res.code < 400) {
            // var token = response.headers["token"];
            // if (token) {
            //     setToken(token);
            // }

        }
        if (res.code === 310) {
            Message({
                message: "没有数据权限",
                type: "warning",
                duration: 5 * 1000
            });
            router.go(-1);
        }
        if (res.code >= 200 && res.code < 300) { return res.data; }

        if (res.code === 401) {
            removeToken();
            router.push({ path: "/" });
        }
        // if the custom code is not 20000, it is judged as an error.
        if (res.code > 401 || res.code === 400) {
            Message({
                message: res.msg || "Error",
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
