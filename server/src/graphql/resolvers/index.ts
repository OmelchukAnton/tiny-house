import merge from 'lodash.merge';
// import { listingResolvers } from "./Listing85depr";
import { viewerResolvers } from "./Viewer";

export const resolvers = merge(viewerResolvers);
