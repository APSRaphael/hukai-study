import React, { Component } from 'react'
import {connect} from 'react-redux';

@connect(({user})=>({user}))
class UserPage extends Component {
    render() {
        console.log('this.props.user :>> ', this.props.user);
        return (
            <div>
                <h3>UserPage</h3>
            </div>
        )
    }
}

export default UserPage
