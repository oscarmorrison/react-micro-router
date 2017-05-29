import React from 'react';
import { render } from 'react-dom';

import '../style/index.scss';

class App extends React.Component {

    getWelcomeText = () => {
        return 'React Webpack Starter';
    }

    render() {
        const welcomeText = this.getWelcomeText();
        return (
            <div>
                <h1>{welcomeText}</h1>
            </div>
        );
    }
}

const Router = Component => class extends Component {

    constructor(props) {
        super(props);
        this.registerListener();
    }

    registerListener = () => {
        window.addEventListener('hashchange', this.routeChanged);
    }

    componentWillUnmount = () => {
        window.removeEventListener('hashchange', this.routeChanged);
    }

    routeChanged = (e) => {
        console.log('routeChanged', e);
    }

    render() {
        return super.render();
    }
};

const AppWithRouter = Router(App);

render(
    <AppWithRouter />,
    document.getElementById('app'),
);
