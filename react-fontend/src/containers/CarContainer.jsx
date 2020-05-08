import React from 'react';
import withWidth from "@material-ui/core/withWidth";
import CarsComponent from "../components/profile/CarsComponent";

const CarContainer = (props) => {
    return (
        <div>
            <CarsComponent/>
        </div>
    );
};

export default withWidth()(CarContainer);