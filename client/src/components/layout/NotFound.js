import React, { Fragment } from "react";
import { FaExclamationTriangle } from "react-icons/fa";

const NotFound = () => {
    return (
        <Fragment>
            <h1 className="x-large text-primary">
                <FaExclamationTriangle /> 404
            </h1>
            <p className="large">Sorry, Page doesn't exist Found!</p>
        </Fragment>
    );
};

export default NotFound;