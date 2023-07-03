import React from 'react';
import { gql } from "apollo-boost"
import { useQuery, useMutation } from "react-apollo";
import { DeleteListingData, DeleteListingVariables, ListingsData } from "./types";
import {List, Avatar, Button, Spin, Alert} from "antd";
import { ListingsSkeleton } from "./components";
import "./styles/Listings.css";

const LISTINGS = gql`
    query Listings {
        listings {
            id
            title
            image
            address
            price
            
            rating
        }
    }
`;

const DELETE_LISTING = gql`
    mutation DeleteListing($id: ID!) {
        deleteListing(id: $id) {
            id
        }
    }
`;

interface IProps {
    title: string;
}

export const Listings = ({ title }: IProps) => {
    const { data, loading, refetch, error }  = useQuery<ListingsData>(LISTINGS);

    const [deleteListing, {
        loading: deleteListingLoading, error: deleteListingError
    }] = useMutation<DeleteListingData, DeleteListingVariables>(DELETE_LISTING);

    const handleDeleteListings = async (id: string) => {
        await deleteListing({ variables: {id} });

        refetch();
    }

    if(loading) {
        return <div className="listings">
            <ListingsSkeleton title={title}/>
        </div>
    }

    if(error) {
        return <div className="listings">
            <ListingsSkeleton title={title} error/>
        </div>
    }

    // const listings = data ? data.listings : null;
    const listingsList = data ?
        (<List itemLayout={"horizontal"} dataSource={data.listings} renderItem={(listing) => (
            <List.Item actions={[
                <Button
                    type="primary"
                    onClick={() => handleDeleteListings(listing.id)}
                >
                    Delete
                </Button>]}
            >
                <List.Item.Meta
                    title={listing.title}
                    description={listing.address}
                    avatar={<Avatar src={listing.image}  shape="square" size={48} />}
                />
            </List.Item>
        )} />
        ) : null;

    const deleteListingErrorAlert = deleteListingError
        ? <Alert
            type="error"
            message="Uh oh! Something went wrong - please try again later"
            className="listings__alert"
        /> : null;

    return <div className="listings">
        <Spin spinning={deleteListingLoading}>
            {deleteListingErrorAlert}
            <h2>{title}</h2>
            {listingsList}
        </Spin>
    </div>
}
