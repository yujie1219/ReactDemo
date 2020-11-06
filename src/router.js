import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link, useRouteMatch, useParams } from 'react-router-dom';

class App extends React.Component {
    route = ['About', 'Topics', 'Home'];
    route2Dom = {
        'Home': <Home />,
        'About': <About />,
        'Topics': <Topics />
    }

    render() {
        return (
            <Router>
                <div>
                    <nav>
                        {this.route.map((route, index) => {
                            return (
                                <li key={index}>
                                    <Link to={'/' + (route === 'Home' ? '' : route.toLowerCase())}>{route}</Link>
                                </li>
                            );
                        })}
                    </nav>
                </div>

                <Switch>
                    {this.route.map((route, index) => {
                        return (
                            <Route path={'/' + (route === 'Home' ? '' : route.toLowerCase())}>
                                {this.route2Dom[route]}
                            </Route>
                        );
                    })}
                </Switch>
            </Router>
        )
    }
}

function Home() {
    return <h2>Home</h2>;
}

function About() {
    return <h2>About</h2>;
}

function Topics() {
    let match = useRouteMatch();

    return (
        <div>
            <h2>Topics</h2>

            <ul>
                <li>
                    <Link to={`${match.url}/components`} >Components</Link>
                </li>
                <l1>
                    <Link to={`${match.url}/props-v-state`} >Props.v.State</Link>
                </l1>
            </ul>

            <Switch>
                <Route path={`${match.url}/:topicId`}>
                    <Topic />
                </Route>
                <Route path={match.path}>
                    <h3>Please select a topic.</h3>
                </Route>
            </Switch>
        </div>
    );
}

function Topic() {
    let topic = useParams();
    console.log(topic);
    return <h3>Requested topic ID: {topic.topicId}</h3>;
}

export default App;