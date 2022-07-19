import Head from 'next/head';
import { Body } from './signupBody';
import { Header } from '../../components/header';
import { canSSRAuth } from '../../utils/canSSRAuth';
import { SignUpProps } from '../../contexts/TypesAndInterfaces';
import { setupAPIClient } from '../../services/api';

// -- START OF THE COMPONENT -- //
export default function SignUp({usersFSSP}: SignUpProps) {

  // --- RETURN --- //
  return (
    <>
      <Head>
        <title>GQS Seguros - Novo Usuário</title>
      </Head>

      <Header activePage='signUpPage'/>

      <Body usersFSSP={usersFSSP} />
    </>
  )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {

  const api = setupAPIClient(ctx)
  const usersFSSP = await api.get("/users")

  return {
    props: {
      usersFSSP: usersFSSP.data,
    }
  }
})