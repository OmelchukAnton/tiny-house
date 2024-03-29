// import { GraphQLID, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString, GraphQLSchema } from "graphql";
// import {listings} from "./listings";
//
// const Listing85depr = new GraphQLObjectType({
//     name: "Listing85depr",
//     fields: {
//         id: { type: new GraphQLNonNull(GraphQLID) },
//         title: { type: new GraphQLNonNull(GraphQLString) },
//         image: { type: new GraphQLNonNull(GraphQLString) },
//         address: { type: new GraphQLNonNull(GraphQLString) },
//         price: { type: new GraphQLNonNull(GraphQLInt) },
//         numOfGuests: { type: new GraphQLNonNull(GraphQLInt) },
//         numOfBeds: { type: new GraphQLNonNull(GraphQLInt) },
//         numOfBaths: { type: new GraphQLNonNull(GraphQLInt) },
//         rating: { type: new GraphQLNonNull(GraphQLInt) }
//     }
// })
// const query = new GraphQLObjectType({
//     name: "Query",
//     fields: {
//         listings: {
//             type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Listing85depr))),
//             resolve: () => listings
//         }
//      }
// });
//
// const mutation = new GraphQLObjectType({
//     name: "Mutation",
//     fields: {
//         deleteListing: {
//             type: new GraphQLNonNull(Listing85depr),
//             args: {
//                 id: { type: new GraphQLNonNull(GraphQLID) }
//             },
//             resolve: (_root, { id }) => {
//                 for(let i = 0; i < listings.length; i++) {
//                     if(listings[i].id === id) {
//                         return listings.splice(i, 1)[0];
//                     }
//                 }
//
//                 throw new Error('failed to delete listing')
//             }
//         }
//     }
// });
//
// export const schema = new GraphQLSchema({ query, mutation })
