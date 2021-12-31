// Libs
import { ReactElement } from 'react'
import { AppContext, AppProps } from 'next/app'
// Components
import { AuthProvider } from '../providers/Auth'
// Global CSS
import 'tailwindcss/tailwind.css'
import '../styles/global.css'

const MyApp = ({ Component, pageProps }: AppProps): ReactElement => (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
)

interface Props {
  pageProps: unknown
}

MyApp.getInitialProps = async ({ Component, ctx }: AppContext): Promise<Props> => {
  const pageProps = {
    ...(Component.getInitialProps ? await Component.getInitialProps(ctx) : {})
  }

  return {
    pageProps
  }
}

export default MyApp
