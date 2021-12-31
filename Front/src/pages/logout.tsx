// Libs
import { ReactElement, useEffect } from 'react'
import { useRouter } from 'next/router'
// custom Functions
import { withAuth } from '../lib'
// Hooks
import { useAuth } from '../providers/Auth'

const Logout = (): ReactElement => {
  const { setAuthenticated } = useAuth()
  const router = useRouter()
  useEffect(() => {
    async function doLogout (): Promise<void> {
      const response = await fetch('/api/logout')
      if (response.status === 200) {
        setAuthenticated(false)
        router.push('/')
      } else {
        console.error('Failed to logout', response)
      }
    }
    doLogout()
  }, [setAuthenticated])
  return <p>Logging out...</p>
}

export const getServerSideProps = withAuth

export default Logout
