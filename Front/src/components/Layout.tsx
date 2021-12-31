// Libs
import { ReactElement, ReactNode } from 'react'
// Components
import Header from './Header'

interface LayoutProps {
  children: ReactNode
}

const Layout = ({ children }: LayoutProps): ReactElement => (
    <>
      <Header />
      <main>{children}</main>
    </>
)

export default Layout
