import { gql } from "apollo-server-express";

export const typeDefs = gql(`
    type Viewer {
        id: ID
        token: String
        avatar: String
        hasWallet: Boolean
        didRequest: Boolean!
    }

    input LogInInput {
        code: String!
    }
    
    type Query {
        authUrl: String!
    }
    
    type Mutation {
        logIn(input: LogInInput): Viewer!
        logOut: Viewer!
    }
`);

// export const typeDefsDEPRICATE = gql(`
//     type Listing85depr {
//         id: ID!
//         title: String!
//         image: String!
//         address: String!
//         price: Int!
//         numOfGuests: Int!
//         numOfBets: Int!
//         numOfBaths: Int!
//         rating: Int!
//     }
//
//     type Query {
//         listings: [Listing85depr!]
//     }
//
//     type Mutation {
//         deleteListing(id: ID!): Listing85depr!
//     }
// `);
