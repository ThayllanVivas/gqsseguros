import Head from 'next/head';
import { Body } from './NewUserBody';
import { Header } from '../../components/header';
import { canSSRAuth } from '../../utils/canSSRAuth';
import { setupAPIClient } from '../../services/api';
import { SignUpProps, UserType } from '../../contexts/TypesAndInterfaces';

// -- START OF THE COMPONENT -- //
export default function NewUser({notAdminUsersFSSP, adminUsersFSSP}: SignUpProps) {

  // --- RETURN --- //
  return (
    <>
      <Head>
        <title>GQS Seguros - Novo Usuário</title>
      </Head>

      <Header activePage='newUserPage'/>

      <Body notAdminUsersFSSP={notAdminUsersFSSP} adminUsersFSSP={adminUsersFSSP}/>
    </>
  )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {

  const api = setupAPIClient(ctx)
  const usersFSSP = await api.get("/users")
  const notAdminUsersFSSP = usersFSSP.data.filter((user: UserType) => user.admin_mode !== true)
  const adminUsersFSSP = usersFSSP.data.filter((user: UserType) => user.admin_mode === true)

  return {
    props: {
      notAdminUsersFSSP: notAdminUsersFSSP,
      adminUsersFSSP: adminUsersFSSP
    }
  }
})