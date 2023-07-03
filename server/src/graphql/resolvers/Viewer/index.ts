// import { IResolvers } from "apollo-server-express";
import crypto from "crypto";
import { Response, Request } from "express"
import {Database, User, Viewer} from "../../../lib/types";
import {LogInArgs} from "./types";
import {Google} from "../../../lib/api/Google";

const cookieOptions = {
    httpOnly: true,
    sameSite: true,
    signed: true,
    secure: process.env.NODE_ENV === "development" ? false : true
}

const logInViaGoogle = async (code: string, token: string, db: Database, res: Response): Promise<User | undefined> => {
    const {user} = await Google.logIn(code);

    if (!user) {
        throw new Error("Google login error");
    }

    // Name/Photo/Email Lists
    const userNameList = user.names && user.names.length ? user.names : null;
    const userPhotosList = user.photos && user.photos.length ? user.photos : null;
    const userEmailList = user.emailAddresses && user.emailAddresses.length ? user.emailAddresses : null;

    // User Display Name
    const userName = userNameList ? userNameList[0].displayName : null;

    // User Id
    const userId = userNameList && userNameList[0].metadata && userNameList[0].metadata.source
        ? userNameList[0].metadata.source.id : null;

    // User Avatar
    const userAvatar = userPhotosList && userPhotosList[0].url ? userPhotosList[0].url : null;

    // User Email
    const userEmail = userEmailList && userEmailList[0].value ? userEmailList[0].value : null;

    if (!userId || !userName || !userAvatar || !userEmail) {
        throw new Error("Google login error");
    }

    const updateRes = await db.users.findOneAndUpdate(
        {_id: userId},
        {

            $set: {
                name: userName,
                avatar: userAvatar,
                contact: userEmail,
                token
            }
        },
        // {returnOriginal: false}

    {
            upsert: true,
            returnDocument: 'after', // this is new !
        }
    )

    let viewer = updateRes.value;

    if(!viewer) {
        const insertResult = await db.users.insertOne({
            _id: userId,
            token,
            name: userName,
            avatar: userAvatar,
            contact: userEmail,
            income: 0,
            bookings: [],
            listings: []
        })

        // @ts-ignore
        viewer = insertResult.ops[0];
        // viewer = insertResult.user;
    }

    res.cookie("viewer", userId, {
        ...cookieOptions,
        maxAge: 365 * 24 * 60 * 60 * 1000
    });

    // @ts-ignore
    return viewer;
};

const logInViaCookies = async (token: string, db: Database, req: Request, res: Response): Promise<User | undefined> => {
    const updateRes = await db.users.findOneAndUpdate(
        {
            _id: req.signedCookies.viewer
        },
        { $set: { token }},
        {
            upsert: false
        }
    )

    let viewer = updateRes.value;

    if(!viewer) {
        res.clearCookie("viewer", cookieOptions)
    }

    // @ts-ignore
    return viewer;
}

export const viewerResolvers = {
    Query: {
        authUrl: (): string => {
            // return "Query.authUrl";
            try {
                return Google.authUrl;
            } catch (error) {
                throw new Error(`Failed to query Google Auth Url: ${error}`);
            }
        }
    },
    Mutation: {
        logIn: async (
            _root: undefined,
            { input }: LogInArgs,
            { db, req, res }: { db: Database, req: Request, res: Response }
        ): Promise<Viewer> => {
            // return "Mutation.logIn";
            try {
                const code = input ? input.code : null;
                const token = crypto.randomBytes(16).toString("hex");

                const viewer: User | undefined = code
                    ? await logInViaGoogle(code, token, db, res)
                    : await logInViaCookies(token, db, req, res);

                if(!viewer) {
                    return { didRequest: true }
                }

                return {
                    _id: viewer._id,
                    token: viewer.token,
                    avatar: viewer.avatar,
                    walletId: viewer.walletId,
                    didRequest: true
                }
            } catch (error) {
                throw new Error(`Failed to log in: ${error}`);
            }
        },
        logOut: (_root: undefined, _args: {}, { res }: { res: Response }): Viewer => {
            // return "Mutation.logOut";
            try {
                res.clearCookie("viewer", cookieOptions);
                return { didRequest: true };
            } catch (error) {
                throw new Error(`Failed to log out: ${error}`);
            }
        }
    },
    Viewer: {
        id: (viewer: Viewer): string | undefined => {
            return viewer._id
        },
        hasWallet: (viewer: Viewer): boolean | undefined => {
            return viewer.walletId ? true : undefined;
        }
    }
};
