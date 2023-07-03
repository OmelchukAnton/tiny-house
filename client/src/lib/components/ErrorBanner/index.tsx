import React from 'react';
import { Alert } from "antd";

interface IProps {
    message?: string;
    description?: string;
}

export const ErrorBanner = ({
    message = "Uh no! Something went wrong :(",
    description = "Look like something went wrong. Please check you connection and/or try again."
}: IProps) => {
    < Alert
        banner
        closable
        message={message}
        description={description}
        type="error"
        className="error-banner"
    />
}
