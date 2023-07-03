import React from "react"
import { Link } from "react-router-dom"
import { Avatar, Button, Menu } from "antd";
import { HomeOutlined, UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { useMutation } from '@apollo/react-hooks';
import { LOG_OUT } from "../../../../lib/graphql/mutations/LogOut/index";
import { dispalySuccessNotification, displayErrorMessage } from "../../../../lib/components/utils/index";
import {Viewer} from "../../../../lib/types";

interface IProps {
    viewer: Viewer;
    setViewer: (viewer: Viewer) => void;
}

const { Item, SubMenu } = Menu;

export const MenuItems = ({ viewer, setViewer }: IProps) => {
    const [logOut] = useMutation(LOG_OUT, {
        onCompleted: (data) => {
            if (data && data.logOut) {
                setViewer(data.logOut);
                dispalySuccessNotification("You've successfully logged out!");
            }
        },
        onError: data => {
            displayErrorMessage("sorry! we weren't able to log you out. Please try again later!");
        }
    });

    const handleLogOut = () => {
        logOut();
    }

    const subMenuLogin = viewer && viewer.id && viewer.avatar ? (
        <SubMenu title={<Avatar src={viewer.avatar} />}>
            <Item key="/user">
                <Link to={`/user/${viewer.id}`}>
                    <UserOutlined />
                    Profile
                </Link>
            </Item>
            <Item key="/logout">
                <div onClick={handleLogOut}>
                    <LogoutOutlined />
                    Log out
                </div>
            </Item>
        </SubMenu>
    ) : (
        <Item>
            <Link to="/login">
                <Button type="primary">Sign In</Button>
            </Link>
        </Item>
    );

    return (
        <Menu mode="horizontal" selectable={false} className="menu">
            <Item key="/host">
                <Link to="/host">
                    <HomeOutlined />
                    Host
                </Link>
            </Item>
            {subMenuLogin}
        </Menu>
    )
}
