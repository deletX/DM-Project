import React from "react"

export default class EventsContainer extends React.Component {
    render() {
        return (
            <h1>{this.props.children}</h1>
        )
    }
}