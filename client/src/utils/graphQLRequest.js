import axios from "axios";
// create an axios instance
const service = axios.create({
    baseURL: "http://127.0.0.1:8081/graphql?", // url = base url + request url
    // withCredentials: true, // send cookies when cross-domain requests
    timeout: 58000, // request timeout
    method: "post"
});
service.interceptors.response.use(
    response => {
        if (response.status === 200) {
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
