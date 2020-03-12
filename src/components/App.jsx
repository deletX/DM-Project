import React from 'react'
import ReactDOM from 'react-dom'

import TestContainer from "./TestContainer"

class App extends React.Component {
    render() {
        return <TestContainer/>
    }
}


ReactDOM.render(<App/>, document.getElementById('app'));