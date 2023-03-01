import graphQLRequest from "@/utils/graphQLRequest";
import request from "@/utils/request";

export function getGuest(guestId) {
    var query = `query guest($guestId: String!) {
        guest(id: $guestId) {
            id
            name
            reservations {
                reservation_id
                guest_id
                guest_name
                guest_contact
                table_size
                expected_arrival_time
                reservation_status
                remark
            }
        }
    }`;
    return graphQLRequest({
        data: { query, variables: { guestId }, }
    });
}

export function addGuest(data) {
    return request({
        url: "/guests",
        method: "POST",
        data
    });
}