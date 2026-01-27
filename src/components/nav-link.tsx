import { Link, type LinkProps, useLocation } from "react-router";

type NavLinkProps = LinkProps;

export function NavLink(props: NavLinkProps) {
  const { pathname } = useLocation();

  return (
    <Link
      data-active={pathname === props.to}
      className="text-muted-foreground hover:text-foreground data-[active=true]:text-foreground data-[active=true]:hover:text-foreground flex items-center gap-1.5 text-sm font-medium transition-colors duration-150"
      {...props}
    />
  );
}
