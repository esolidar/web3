/* eslint-disable no-undef */
interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => <div className="container">{children}</div>;

export default Layout;
