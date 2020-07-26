import React from 'react'

import Logo from '../assets/images/fon-logo.png'



class Header extends React.Component {

    render() {

        return (

            <header className={'p-2'}>
                <img src={Logo} alt="Fon"/>
            </header>

        )
    }
}

export default Header;