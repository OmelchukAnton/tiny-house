interface IListing {
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

export const listings: IListing[] = [
    {
        id: "001",
        title: "Clean and fully finished",
        image: "",
        address: "3210 Scotchmere Dr W, Toronto, ON, CA",
        price: 10000,
        numOfGuests: 2,
        numOfBeds: 1,
        numOfBaths: 2,
        rating: 5
    },
    {
        id: "002",
        title: "Luxurious home with private pool",
        image: "",
        address: "100 Holywood Hills Dr, Los Angeles, California",
        price: 15000,
        numOfGuests: 2,
        numOfBeds: 1,
        numOfBaths: 1,
        rating: 4
    }
]
