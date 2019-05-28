import * as React from 'react';

export interface INavBarProps {
}

export interface INavBarState {
}

export default class NavBar extends React.Component<INavBarProps,
    INavBarState> {
    constructor(props: INavBarProps) {
        super(props);
    }

    render() {
        return (
            <div>
                <nav className="navbar navbar-expand-sm navbar-dark bg-dark">
                    <a className="navbar-brand" href="#"> Nyhetsinspeksjon</a>
                    <button className="navbar-toggler" type="button" data-toggle="collapse"
                            data-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false"
                            aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
                        <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
                        </ul>
                    </div>
                </nav>
                {/*need to comment away some code
                <nav className={'navbar navbar-expand-sm navbar-dark bg-dark'}>
                    <h2 className={'navbar-brand'}>Nyhets inspeksjon</h2>
                    <div className={'collapse navbar-collapse'}>
                        <ul className={'navbar-nav mr-auto'}>
                            <li className={'nav-item'}>
                                <a className={'nav-link'} href={'#'}> Instillinger </a>
                            </li>
                        </ul>
                    </div>
                </nav>
               very cools search field, will maybe use
                        <form className="form-inline my-2 my-lg-0">
                            <input className="form-control mr-sm-2" type="search" placeholder="Search"
                                   aria-label="Search"/>

                                <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
                        </form>
                -->
               */}
            </div>
    );
    }
    }

