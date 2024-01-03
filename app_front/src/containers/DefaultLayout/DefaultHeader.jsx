import React, { Component } from 'react'

import {  
  DropdownItem, 
  DropdownMenu, 
  DropdownToggle, 
  Nav 
} from 'reactstrap'
import PropTypes from 'prop-types'

import {
  AppHeaderDropdown, 
  AppNavbarBrand, 
  AppSidebarToggler
} from '@coreui/react'

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class DefaultHeader extends Component {
  render() {

    // eslint-disable-next-line
    const { children, ...attributes } = this.props;

    return (
      <React.Fragment>
        <AppSidebarToggler className="d-lg-none" display="md" mobile />
          <AppNavbarBrand />
        <AppSidebarToggler className="d-md-down-none" display="lg" />
        <Nav className="ml-auto" navbar>
          <AppHeaderDropdown direction="down">
            <DropdownToggle nav>
              <i className="icon-equalizer icons"></i>
            </DropdownToggle>
            <DropdownMenu right style={{ right: 'auto' }}>
              <DropdownItem 
                onClick={e => this.props.onLogout(e)}
              >
                <i className="fa fa-lock"></i> Logout
              </DropdownItem>
            </DropdownMenu>
          </AppHeaderDropdown>
        </Nav>
      </React.Fragment>
    );
  }
}

DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;

export default DefaultHeader;
