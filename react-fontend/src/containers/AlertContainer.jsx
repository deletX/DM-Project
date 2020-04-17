import React from 'react'
import AlertItem from "../components/alerts/AlertItem";

export default function AlertContainer(props) {
    let alertItems = props.alerts.map((alert) => (
        <AlertItem key={alert.id} alert={alert}/>
    ));

    return (
        <div className="alert-container">
            {alertItems}
        </div>
    )

}