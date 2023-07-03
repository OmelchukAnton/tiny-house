export interface IListing {
    id: string;
    title: string,
    image: string,
    address: string,
    price: number,
    numOfGuests: number,
    numOfBeds: number,
    numOfBaths: number,
    rating: number
}

export interface ListingsData {
    listings: IListing[];
}

export interface DeleteListingData {
    deleteListing: IListing
}

export interface DeleteListingVariables {
    id: string;
}
