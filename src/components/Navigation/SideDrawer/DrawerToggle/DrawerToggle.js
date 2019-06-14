import React from 'react';
import menuLogo from '../../../../assets/images/menu-logo.png';
import classes from './DrawerToggle.css'

const drawerToggle = (props) => (
    <div onClick={props.clicked}>
        <img src={menuLogo} alt="mobile-menu-logo" className={classes.MobileLogo}/>
    </div>
);

export default drawerToggle;