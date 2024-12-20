import { Link, useLocation } from "react-router-dom";

function Nav({links, activeIndexState}) {
    const linkClass = "navbar-element"
    const activeLinkClass = linkClass + " active"

    const location = useLocation()

    return (
        <div className="navbar">

            {
                links.map( (link, i)=>{
                    return <Link
                        className={location.pathname==link.href? activeLinkClass: linkClass}
                        to={link.href}
                    >
                        {link.name}
                    </Link>
                })
            }

        </div>
    )
}

export default Nav;