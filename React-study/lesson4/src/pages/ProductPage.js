import React, { Component } from "react";

import {
  Route,
  Link,
  useParams,
  useRouteMatch,
  withRouter,
  Prompt,
} from "../k-react-router-dom";
// import {
//   BrowserRouter as Router,
//   // HashRouter as Router,
//   // MemoryRouter as Router,
//   Route,
//   Link,
//   Switch,
//   Redirect,
//   useHistory,
//   useLocation,
//   useRouteMatch,
//   useParams,
//   withRouter,
//   Prompt,
// } from "react-router-dom";

// export default function ProductPage(props) {
//   const { location, match } = props;
//   console.log("location :>> ", location);
//   console.log("match :>> ", match);
//   const {
//     url,
//     params: { id },
//   } = match;

//   const { params, url: hookUrl } = useRouteMatch();
//   console.log("url :>> ", hookUrl);
//   console.log('params :>> ', params);
//   return (
//     <div>
//       ProductPage-{id}
//       <Link to={url + "/detail"}>详情</Link>
//       <Route path={url + "/detail"} component={Detail} />
//     </div>
//   );
// }

// @withRouter
// class ProductPage extends Component {
//   render() {
//     const { params, url } = this.props.match;
//     const { id } = params;
//     return (
//       <div>
//         ProductPage-{id}
//         <Link to={url + "/detail"}>详情</Link>
//         <Route path={url + "/detail"} component={Detail} />
//       </div>
//     );
//   }
// }

// export default ProductPage;

// function Detail({ match }) {
//   console.log("match 222:>> ", match);
//   return <div>{match.url}</div>;
// }

@withRouter
class ProductPage extends Component {
  constructor(props) {
    super(props);
    this.state = { confirm: true };
  }
  render() {
    console.log("ProductPage :>> ", this.props);
    return (
      <div>
        <h3>ProductPage</h3>
        <button
          onClick={() => {
            this.setState({ confirm: !this.state.confirm });
          }}
        >
          CHANGE
        </button>
        <Link to="/">go home</Link>
        <Prompt
          when={this.state.confirm}
          message={( location ) => {
            console.log("location11 :>> ", location);
            return "Are you sure ?";
          }}
          // message="你确定要离开吗？"
        />
      </div>
    );
  }
}

export default ProductPage;
