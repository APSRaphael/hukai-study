import { Route, Redirect } from 'react-router-dom';
import { conne
	ct } from 'react-redux';

import React from 'react';

function PrivateRoute({ isLogin, component: Component, ...rest }) {
	console.log('isLogin :>> ', isLogin);
	return (
		<Route
			{...rest}
			render={(props) =>
				isLogin ? (
					<Component {...props} />
				) : (
					<Redirect
						to={{
							pathname: '/login',
							state: { from: props.location.pathname },
						}}
					/>
				)
			}
		/>
	);
}

export default connect(({ user }) => ({ isLogin: user.isLogin }))(PrivateRoute);
