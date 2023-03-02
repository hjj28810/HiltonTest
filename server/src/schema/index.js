const { GraphQLObjectType,
    GraphQLSchema,
    GraphQLString,
    // GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLEnumType } = require('graphql');

const guestService = require('../service/guest')
const reservationService = require('../service/reservation')

// const TableSizeTypes = new GraphQLEnumType({
//     name: "TableSizeEnum",
//     values: {
//         TwoPerson: {
//             value: 0,
//         },
//         FourPerson: {
//             value: 1,
//         },
//         // 2: {
//         //     value: "6 Person",
//         // },
//         // 3: {
//         //     value: "More than 8 Person",
//         // },
//     }
// })

// const ReservationStatusTypes = new GraphQLEnumType({
//     name: "ReservationStatusEnum",
//     values: {
//         GuestReserved: {
//             value: 0,
//         },
//         GuestCancelled: {
//             value: 1,
//         },
//         EmpConfirmed: {
//             value: 10,
//         },
//         EmpCancelled: {
//             value: 11,
//         },
//     }
// })

const Reservation = new GraphQLObjectType({
    name: 'Reservation',
    description: 'Reservation对象',
    fields: {
        reservation_id: {
            type: GraphQLString
        },
        guest_id: {
            type: GraphQLString
        },
        guest_name: {
            type: GraphQLString
        },
        guest_contact: {
            type: GraphQLString
        },
        table_size: {
            type: GraphQLInt
        },
        expected_arrival_time: {
            type: GraphQLInt
        },
        reservation_status: {
            type: GraphQLInt
        },
        remark: {
            type: GraphQLString
        },
    }
});

const Guest = new GraphQLObjectType({
    name: 'Guest',
    description: 'Guest对象',
    fields: {
        id: {
            type: GraphQLString
        },
        name: {
            type: GraphQLString
        },
        reservations: {
            type: new GraphQLList(Reservation),
            resolve: async function (parentValue, _) {
                return await reservationService.getReservationsAsync({ guest_id: parentValue.id })
            }
        }
    }
});


const Query = new GraphQLObjectType({
    name: 'Query',
    fields: {
        guest: {
            type: Guest,
            args: {
                id: {
                    type: GraphQLString
                },
            },
            resolve: async function (_, args) {
                return await guestService.getGuestAsync(args.id)
            }
        }
    },
});

module.exports = new GraphQLSchema({
    query: Query
});