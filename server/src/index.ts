require('dotenv').config();

import express, { Application } from 'express';
import cookieParser from "cookie-parser";
import { ApolloServer } from "apollo-server-express";
import { connectDatabase } from "./database";
import { typeDefs } from "./graphql/typeDefs";
import { resolvers } from "./graphql/resolvers/index";

// import bodyParser from "body-parser";
// import { listings } from "./listings";



// const app = express();
// const port = 9000;

// async function a(){
//     const server = new ApolloServer({ typeDefs, resolvers });
//     await server.start();
//     server.applyMiddleware({app, path: "/api"});
// }
// a();

// app.use(bodyParser.json());

// app.get("/listings", (_req, res) => {
//     return res.send(listings);
// })

// app.post("/delete-listing", (req, res) => {
//     const id: string = req.body.id;
//
//     for(let i = 0; i < listings.length; i++) {
//         if(listings[i].id === id) {
//             return res.send(listings.splice(i, 1));
//         }
//     }
//
//     return res.send("failed to delete listing");
// })

// app.listen(port);


const mount = async (app: Application) => {
    const db = await connectDatabase();

    app.use(cookieParser(process.env.SECRET))

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: ({ req, res }) => ({ db, req, res })
    });
    await server.start();
    server.applyMiddleware({app, path: "/api"});

    app.listen(process.env.PORT);

    // const listings = await db.listings.find({}).toArray();
    // console.log(listings);
}

mount(express());
