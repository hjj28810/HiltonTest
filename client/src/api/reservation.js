import request from "@/utils/request";

export function getReservation(id) {
    return request({
        url: "/reservations/" + id,
        method: "get",
    });
}

export function getReservations(guest_id, started_at, ended_at) {
    return request({
        url: "/reservations",
        method: "get",
        params: { guest_id, started_at, ended_at }
    });
}


export function addReservation(data) {
    return request({
        url: "/reservations",
        method: "post",
        data
    });
}

export function updateReservation(data) {
    return request({
        url: "/reservations",
        method: "put",
        data
    });
}


