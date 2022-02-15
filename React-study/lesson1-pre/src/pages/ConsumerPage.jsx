import React, { Component } from 'react';
import { Context, UserContext } from '../Context.js';

export default class ConsumerPage extends Component {
	render() {
		return (
			<div>
				<h3>ConsumerPage</h3>
				<Context.Consumer>
					{(theme) => {
						return (
							<div>
								{theme}
								<UserContext.Consumer>
									{(user) => {
										return <User theme={theme} user={user} />;
									}}
								</UserContext.Consumer>
							</div>
						);
					}}
				</Context.Consumer>
			</div>
		);
	}
}

const User = (props) => {
	return <div>{props.user}</div>;
};
