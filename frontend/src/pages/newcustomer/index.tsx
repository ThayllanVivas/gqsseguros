// -- START OF IMPORTS -- //
import Head from "next/head";
import { Body } from "./newcustomerBody";
import { Header } from "../../components/header";
import { canSSRAuth } from "../../utils/canSSRAuth";
import { setupAPIClient } from "../../services/api";
import { NewCustomerProps } from "../../contexts/TypesAndInterfaces";

// -- START OF THE COMPONENT -- //
export default function customer({customersFSSP}: NewCustomerProps) {

    // --- RETURN --- //
    return (
        <>
            <Head>
                <title>GQS Seguros - Novo Cliente</title>
            </Head>

            <Header activePage='customerPage'/>

            <Body customersFSSP={customersFSSP}/>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async(ctx) => {
    const api = setupAPIClient(ctx)

    const customersFSSP = await api.get('/customers')
    
    return {
        props: {
            customersFSSP: customersFSSP.data
        }
    }
})