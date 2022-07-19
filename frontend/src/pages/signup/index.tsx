import Head from 'next/head';
import { Body } from './signupBody';
import { Header } from '../../components/header';
import { canSSRAuth } from '../../utils/canSSRAuth';
import { SignUpProps, UserType } from '../../contexts/TypesAndInterfaces';
import { setupAPIClient } from '../../services/api';

// -- START OF THE COMPONENT -- //
export default function SignUp({notAdminUsersFSSP}: SignUpProps) {

  // --- RETURN --- //
  return (
    <>
      <Head>
        <title>GQS Seguros - Novo Usuário</title>
      </Head>

      <Header activePage='signUpPage'/>

      <Body notAdminUsersFSSP={notAdminUsersFSSP}/>
    </>
  )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {

  const api = setupAPIClient(ctx)
  const usersFSSP = await api.get("/users")
  const notAdminUsersFSSP = usersFSSP.data.filter((user: UserType) => user.admin_mode !== true)

  return {
    props: {
      notAdminUsersFSSP: notAdminUsersFSSP
    }
  }
})