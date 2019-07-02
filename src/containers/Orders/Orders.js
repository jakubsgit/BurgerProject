import React, {Component} from 'react';
import {Route} from 'react-router-dom';

import Order from '../../components/Order/Order/Order'


class Orders extends Component {
    render () {
        return(
            <div>
                <Order />
                <Order />
            </div>
        );
    }
}

export default Orders;