// import { IResolvers } from 'apollo-server-express';
// import { listings } from "../listings";
import {Database, Listing} from "../lib/types";
import {ObjectId} from "mongodb";

// DEPRECATED


// export const resolvers: IResolvers = {
export const resolv = {
    // Query: {
    //     listings: () => {
    //         return listings;
    //     }
    // },
    Query: {
        listings: async (
            _root: undefined,
            _args: {},
            { db }: { db: Database}
        ) => {
        // ): Promise<Listing85depr[]> => {
            return await db.listings.find({}).toArray();
        }
    },
    // Mutation: {
    //     deleteListing: (_root: undefined, { id }: { id: string }) => {
    //         for(let i = 0; i < listings.length; i++) {
    //             if(listings[i].id === id) {
    //                 return listings.splice(i, 1)[0];
    //             }
    //         }
    //
    //         throw new Error('failed to delete listing')
    //     }
    // }
    Mutation: {
        deleteListing: async (
            _root: undefined,
            { id }: { id: string },
            { db }: { db: Database}
        ): Promise<Listing> => {
            const deleteRes = await db.listings.findOneAndDelete({
                _id: new ObjectId(id)
            });

            if(!deleteRes.value) {
               throw new Error('failed to delete listing');
            }

            return deleteRes.value
        }
    },
    Listing: {
        id: (listing: Listing): string => listing._id.toString(),
    }
};
