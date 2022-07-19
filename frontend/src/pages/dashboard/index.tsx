// -- START OF IMPORTS -- //
import Head from 'next/head'
import { Body } from './dashboardBody'
import { Header } from "../../components/header"
import { canSSRAuth } from "../../utils/canSSRAuth"
import { setupAPIClient } from "../../services/api"
import { DashboardProps } from '../../contexts/TypesAndInterfaces'

// -- START OF THE COMPONENT -- //
export default function Dashboard({tasksFSSP, customersFSSP, categoriesFSSP}: DashboardProps){

    // --- RETURN --- //
    return (
        <>
            <Head>
                <title>GQS Seguros</title>
            </Head>

            <Header activePage='dashboardPage' />
            
            <Body 
                tasksFSSP={tasksFSSP} 
                customersFSSP={customersFSSP}
                categoriesFSSP={categoriesFSSP}
            />
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {

    const api = setupAPIClient(ctx)
    const tasksFSSP = await api.get("/tasks")
    const customersFSSP = await api.get("/customers")
    const categoriesFSSP = await api.get("/categories")

    return {
      props: {
            tasksFSSP: tasksFSSP.data,
            customersFSSP: customersFSSP.data,
            categoriesFSSP: categoriesFSSP.data
      }
    }
})