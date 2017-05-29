/* eslint no-console: 0 */
import React from 'react';
import { render } from 'react-dom';
import createHistory from 'history/createBrowserHistory';

import '../style/index.scss';

class App extends React.Component {

    routes = () => ({
        '/': 'home',
        '/about': 'about',
    })

    home = () => {
        return <div>home</div>;
    }

    about = () => {
        return <div>about</div>;
    }

}

const history = createHistory();

const _404 = () => {
    return <div><h1>404</h1><p>Route not found</p></div>;
};

const getRouteNameFromHash = hash => hash.replace('#', '/') || '/';

const Router = Component => class extends Component {

    constructor(props) {
        super(props);
        const routeName = getRouteNameFromHash(window.location.hash);
        this.state = { routeName };
        this.registerListener();
    }

    registerListener = () => {
        this.unlisten = history.listen(this.routeChanged);
    }

    componentWillUnmount = () => {
        this.unlisten();
    }

    routeChanged = (location, action) => {
        console.log('routeChanged', location, action);
        const routeName = getRouteNameFromHash(location.hash);
        this.setState({ routeName });
    }

    render() {
        const { routeName } = this.state;
        const routes = this.routes();
        const componentName = routes[routeName] || routes['/_404'];
        const RouteComponent = this[componentName] || _404;
        return <RouteComponent {...this.props} />;
    }
};

const AppWithRouter = Router(App);

render(
    <AppWithRouter />,
    document.getElementById('app'),
);
