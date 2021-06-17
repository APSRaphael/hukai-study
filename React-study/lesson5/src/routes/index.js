import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import UserPage from '../pages/UserPage';
import _404Page from '../pages/_404Page';
import PrivateRoute from './PrivateRoute';

export const routes = [
	{ path: '/', exact: true, component: HomePage },
	{ path: '/user', component: UserPage, Auth: PrivateRoute },
	{ path: '/login', component: LoginPage },
	{ component: _404Page },
];
export default function Routes(props) {
	return (
		<Router>
			<Link to='/'>首页</Link>
			<Link to='/user'>用户中心</Link>
			<Link to='/login'>登录</Link>
			<Switch>
				{/* <Route path='/' exact component={HomePage} />
				<Route path='/login' exact component={LoginPage} />
				<PrivateRoute path='/user' component={UserPage} />
				<Route component={_404Page} /> */}
				{routes.map((Route_, index) =>
					Route_.Auth ? (
						<Route_.Auth key={Route_.path + index} {...Route_} />
					) : (
						<Route key={Route_.path + index} {...Route_} />
					)
				)}
			</Switch>
		</Router>
	);
}
