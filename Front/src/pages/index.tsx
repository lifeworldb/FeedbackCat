// Libs
import { ReactElement } from 'react'
// Components
import Layout from '../components/Layout'

const Home = (): ReactElement => (
    <Layout>
      <h1 className="title">
        Welcome to <a href="https://nextjs.org">Next.js!</a>
      </h1>

      <p className="description">
        Get started by editing <code>pages/index.js</code>
      </p>

      <h1 className="text-3xl font-bold underline">
        Hello world!
      </h1>
    </Layout>
)

export default Home
