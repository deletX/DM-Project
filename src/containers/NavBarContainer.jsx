import React from "react"
import LoginLogoutButton from "../components/LoginLogoutButton";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {login, logout} from "../actions/userActions";
import {Link} from "react-router-dom";
import {urls} from "../constants";

class NavBarContainer extends React.Component {

    render() {
        return (
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <Link className="navbar-brand" to={urls.events}>DMProject</Link>
                <button className="navbar-toggler" type="button" data-toggle="collapse"
                        data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                        aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"/>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item active">
                            <Link className="nav-link" to={urls.events}>Events <span
                                className="sr-only">(current)</span></Link>
                        </li>
                        {this.props.isSignedIn &&
                        <li className="nav-item">
                            <Link className="nav-link" to={urls.myEvents}>Your Events</Link>
                        </li>
                        }
                        {this.props.isSignedIn &&
                        <li className="nav-item">
                            <Link className="nav-link disabled" to={urls.profile}>Profile</Link>
                        </li>
                        }
                    </ul>
                    <form className="form-inline my-2 my-lg-0">
                        <LoginLogoutButton/>
                    </form>
                </div>
            </nav>
        )
    }
}

NavBarContainer.propTypes = {
    isSignedIn: PropTypes.bool
};

const mapStateToProps = state => ({
    isSignedIn: state.user.isSignedIn
});

export default connect(mapStateToProps, {})(NavBarContainer);