/* eslint no-console: 0 */
/* eslint no-cond-assign: 0 */
import React from 'react';
import { render } from 'react-dom';

import '../style/index.scss';

class App extends React.Component {

    routes = () => ({
        '/': 'home',
        '/about': 'about',
        '/contact': 'contact',
    })

    home = (props) => {
        console.log(props);
        // props.changeRoute('about', { foo: 'bar' });
        return <div>home</div>;
    }

    about = (props) => {
        console.log(props);
        props.changeRoute('/', { foo: 'bar' });
        return <div>about</div>;
    }

    contact = (props) => {
        return <div>contact {props.routeName}</div>;
    }

}

const _404 = (props) => {
    return (
        <div>
            <h1>404</h1>
            <p>{props.routeName}</p>
            <p>Route not found</p>
        </div>
    );
};

const ROUTE_REGEX = /(?:#)(\w+)/;

const getRoute = () => {
    let route = '/';
    const match = ROUTE_REGEX.exec(location);
    route += match && match[1] || '';
    return route;
};

const PARAM_REGEX = /(?:\?|&)(\w+)=(\w+)/g;

const getParams = () => {
    let match;
    const params = {};
    while (match = PARAM_REGEX.exec(window.location.hash)) {
        params[match[1]] = match[2];
    }
    return params;
};

const getParamString = (params) => {
    if (!Object.keys(params).length) return '';
    return Object.keys(params).reduce((sum, key) => (`${sum}${key}=${params[key]}&`), '?').slice(0, -1);
};

const Router = Component => class extends Component {

    constructor(props) {
        super(props);
        const routeName = getRoute();
        const params = getParams();
        this.state = { routeName, params };
    }

    componentWillMount = () => {
        window.addEventListener('hashchange', this.routeChanged);
    };

    componentWillUnmount = () => {
        window.removeEventListener('hashchange', this.routeChanged);
    };

    changeRoute = (route) => {
        route = route.replace(/^\//, '#');
        const { params } = this.state;
        const paramString = getParamString(params);
        window.location.hash = `${route}${paramString}`;
    };

    routeChanged = () => {
        const routeName = getRoute();
        const params = getParams();
        this.setState({ routeName, params });
    };

    render() {
        const { routeName } = this.state;
        const routes = this.routes();
        const componentName = routes[routeName] || routes['/404'];
        const RouteComponent = this[componentName] || _404;
        return (<RouteComponent
            {...this.props}
            {...this.state}
            changeRoute={this.changeRoute}
        />);
    }
};

const AppWithRouter = Router(App);

render(
    <AppWithRouter />,
    document.getElementById('app'),
);
