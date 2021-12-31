// Libs
import { ReactElement } from 'react'
// Custom Functions
import { withAuth } from '../lib'
// Components
import Layout from '../components/Layout'

const Profile = (): ReactElement => (
    <Layout>
      <h1>Profile</h1>
    </Layout>
)

export const getServerSideProps = withAuth

export default Profile
