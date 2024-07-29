import { useContext } from "react";
import { NavContext } from "../App";
import { NavLink } from "react-router-dom";

const Header = () => {
  const {columns} = useContext(NavContext);

  return (
    <header>
        <nav>
          <NavLink to=''>
            <p>{columns.length > 0 ? 'Show All' : 'The Board App'}</p>
          </NavLink>
          {columns.map((column, index) => <NavLink key={index} to={column.slice(0, column.length-6)}><p>{column.slice(0, column.length - 6)}</p></NavLink>)}
        </nav>
    </header>
  )
}

export default Header;