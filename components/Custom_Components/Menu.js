import Dropdown from 'react-bootstrap/Dropdown';

function Menu({ className, title, menuItems }) {
    return (
        <Dropdown className={'menu-btn '+(className || '')}>
            <Dropdown.Toggle >{title}</Dropdown.Toggle>
            <Dropdown.Menu>
                {menuItems}
            </Dropdown.Menu>
        </Dropdown>
    );
}
export default Menu;