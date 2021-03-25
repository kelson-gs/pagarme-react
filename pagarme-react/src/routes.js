import React, { Component } from 'react';
import {
    BrowserRouter,
    Switch,
    Route,
} from 'react-router-dom';
import Forms from './views/forms';
import Dashboard from './views/dashboard';
import Client from './views/client';
import Extrato from './views/extratos';

class Routes extends Component {
    render(){
        return(
            <div>
                <BrowserRouter>
                    <Switch>
                        <Route exact path='/' component={Forms} />
                        <Route path="/dashboard" component={Dashboard}/>
                        <Route path="/extratos" component={Extrato}/>
                        <Route path="/:id/client" component={Client}/>
                    </Switch>
                </BrowserRouter>
            </div>
        );
    }
}

export default Routes;