import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';
import { AppHeader, Home, Host, Listing, Listings, Login, NotFound, User } from "./sections";
import { Affix,  Layout } from "antd";
import {Viewer} from "./lib/types";

const client = new ApolloClient({
    uri: "http://localhost:9000/api"
});

const initialViewer = {
    id: null,
    token: null,
    avatar: null,
    hasWallet: null,
    didRequest: false
};

const App = () => {
    const [viewer, setViewer] = useState(initialViewer);
    console.log(viewer);

    return (
        <Router>
            <Layout id="app">
                <Affix offsetTop={0} className="app__affix-header">
                    <AppHeader viewer={viewer}/>
                </Affix>
                <Routes>
                    <Route exact path="/" element={<Home />} />
                    <Route exact path="/host" element={<Host />} />
                    <Route exact path="/listing/:id" element={<Listing />} />
                    <Route exact path="/listings/:location?" element={<Listings />} />
                    <Route exact path="/login" element={<Login setViewer={setViewer} />} />
                    <Route exact path="/user/:id?" element={<User />} />
                    <Route element={<NotFound />} />
                </Routes>
            </Layout>
        </Router>
    )
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>
)
