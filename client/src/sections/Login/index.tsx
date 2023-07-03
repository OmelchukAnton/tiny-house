import React, {useEffect, useRef} from "react";
import { useNavigate } from "react-router-dom"
import { Card, Layout, Typography, Spin } from "antd";
import { useApolloClient, useMutation } from '@apollo/react-hooks';
import googleLogo from "./assets/google_logo.jpg";
import {Viewer} from "../../lib/types";
import {AUTH_URL} from "../../lib/graphql/queries/AuthUrl/index";
import { LOG_IN } from "../../lib/graphql/mutations/LogIn/index";
import {dispalySuccessNotification, displayErrorMessage} from "../../lib/components/utils/index";
// import { AuthUrl as AuthUrlData }

interface Props {
    setViewer: (viewer: Viewer) => void;
}

const { Content } = Layout;
const { Text, Title } = Typography;

export const Login = ({ setViewer }: Props) => {
    let navigate = useNavigate();
    const client = useApolloClient();
    const [logIn, { data: logInData, loading: logInLoading, error: logInError }] = useMutation(LOG_IN, {
        onCompleted: (data) => {
            if(data && data.logIn) {
                setViewer(data.logIn)
                dispalySuccessNotification("You've successfully logged in!");
            }
        }
    });

    const logInRef = useRef(logIn);

    useEffect(() => {
        const code = new URL(window.location.href).searchParams.get("code");

        if(code) {
            logInRef.current({
                variables: {
                    input: { code }
                }
            });
        }
    }, []);

    const handleAuthorize = async () => {
        try {
            const { data } = await client.query({
                query: AUTH_URL
            });
            window.location.href = data.authUrl;
        } catch {
            displayErrorMessage("Sorry! we weren't able to log you in.")
        }
    }

    if(logInLoading) {
        return (
            <Content className="log-in">
                <Spin size="large" tip="Logging you in ..." />
            </Content>
        )
    }

    if(logInData && logInData.logIn) {
        const { id: viewerId } = logInData.logIn;
        return navigate(`/user/${viewerId}`);
    }

    const logInErrorBannerElement = logInError ? (
        <ErrorBoundary description="Sorry! we weren't able to log you in." />
    ) : null;

    return (
        <Content className="log-in">
            {logInErrorBannerElement}
            <Card className="log-in-card">
                <div className="log-in-card__intro">
                    <Title level={3} className="log-in-card__intro-title">
                        <span role="img" aria-label="wave">
                            👋
                        </span>
                    </Title>
                    <Title level={3} className="log-in-card__intro-title">
                        Login to tiny
                    </Title>
                    <Text>Sign in with Google to start booking available rentals!</Text>
                </div>
                <button className="log-in-card__google-button" onClick={handleAuthorize}>
                    <img src={googleLogo} alt="Google logo" className="log-in-card__google-button-logo" height={50} width={50} />
                    <span className="log-in-card__google-button-text">
                        Sign in with Google
                    </span>
                </button>
                <Text type="secondary">
                    Note: by signing in, you'll be redirected to the Google consent form
                    to sign in with Google account.
                </Text>
            </Card>
        </Content>
    )
}
