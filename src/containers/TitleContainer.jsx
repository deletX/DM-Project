import React from "react"
import PropTypes from "prop-types";
import {connect} from "react-redux";
import LoginLogoutButton from "../components/LoginLogoutButton";
import {Link} from "react-router-dom";
import {urls} from "../constants";

class TitleContainer extends React.Component {

    render() {
        return (
            <div id="title-bar" className="jumbotron">
                <h1 className="display-4">DMProject - car sharing solution</h1>
                <p className="lead">The best tool to find the perfect route for you car sharing needs for any event</p>
                <hr className="my-4"/>
                {this.props.isSignedIn &&
                <p>Welcome back <b>{this.props.name}</b>! Click on your events to see your joined events</p>
                }
                {!this.props.isSignedIn &&
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut dapibus faucibus urna et venenatis.
                    Maecenas at sagittis felis. Sed aliquam. </p>
                }
                {this.props.isSignedIn &&
                <p className="lead">
                    <Link className="btn btn-primary btn-lg" to={urls.joined} role="button">Joined Events</Link>
                </p>
                }
            </div>
        )
    }
}

TitleContainer.propTypes = {
    isSignedIn: PropTypes.bool,
    name: PropTypes.string
};

const mapStateToProps = state => ({
    isSignedIn: state.user.isSignedIn,
    name: state.user.user_data.name
});

export default connect(mapStateToProps, {})(TitleContainer);