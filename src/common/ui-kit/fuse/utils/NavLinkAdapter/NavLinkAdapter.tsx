import { forwardRef } from 'react'
import { NavLink, NavLinkProps } from 'react-router-dom'

const NavLinkAdapter = forwardRef<HTMLAnchorElement, NavLinkProps>((props, selectedRef) => {
    return <NavLink innerRef={selectedRef} {...props} />
})

export default NavLinkAdapter
