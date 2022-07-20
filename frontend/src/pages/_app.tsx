import '../../styles/globals.scss'
import 'react-toastify/dist/ReactToastify.css';
import { AppProps } from 'next/app'
import { AuthProvider } from '../contexts/AuthContext'
import { ToastContainer } from 'react-toastify';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Component {... pageProps} />
      <ToastContainer autoClose={1500}/>
    </AuthProvider>
  )
}

export default MyApp
