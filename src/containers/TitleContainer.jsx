import React from "react"

export default class TitleContainer extends React.Component {
    render() {
        return (
            <h1>{this.props.children}</h1>
        )
    }
}