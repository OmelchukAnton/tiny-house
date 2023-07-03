import React from "react";
import { Link } from "react-router-dom";
import { Layout } from "antd";
import { MenuItems } from "./components/MenuItems/index";

import logo from "./assets/home-logo.jpg";
import {Viewer} from "../../lib/types";

interface IProps {
    viewer: Viewer;
    setViewer: (viewer: Viewer) => void;
}

const { Header } = Layout;

export const AppHeader = ({viewer, setViewer}: IProps) => {
    return (
        <Header className="app-header">
            <div className="app-header__logo-search-section">
                <div className="app-header__logo">
                    <Link to={"/"}>
                        <img src={logo} alt="App logo" width={50} height={50}/>
                    </Link>
                </div>
            </div>
            <div className="app-header__menu-section">
                <MenuItems viewer={viewer} setViewer={setViewer}/>
            </div>
        </Header>
    )
}
