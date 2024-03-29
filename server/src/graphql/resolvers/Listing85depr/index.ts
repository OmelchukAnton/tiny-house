import {ObjectId} from "mongodb";
import {Database, Listing} from "../../../lib/types";

export const listingResolvers = {
    Query: {
        listings: async (
            _root: undefined,
            _args: {},
            { db }: { db: Database}
        ) => {
            // ): Promise<Listing85depr[]> => {
            // throw new Error("Error!");
            return await db.listings.find({}).toArray();
        }
    },

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
