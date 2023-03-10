// -- START OF IMPORTS -- //
import Head from "next/head";
import { Body } from "./newtaskBody";
import { Header } from "../../components/header";
import { canSSRAuth } from "../../utils/canSSRAuth";
import { NewTaskProps } from "../../contexts/TypesAndInterfaces";
import { setupAPIClient } from "../../services/api";

// -- START OF THE COMPONENT -- //
export default function NewTask({categoriesFSSP, branchesFSSP, customersFSSP}: NewTaskProps) {

    // --- RETURN --- //
    return (
        <>
            <Head>
                <title>GQS Seguros - Nova Tarefa</title>
            </Head>
            <Header activePage='newTaskPage' />

            <Body categoriesFSSP={categoriesFSSP} branchesFSSP={branchesFSSP} customersFSSP={customersFSSP}/>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async(ctx) => {
    const api = setupAPIClient(ctx)

    const branchesFSSP = await api.get("/branches")
    const categoriesFSSP = await api.get("/categories")
    const customersFSSP = await api.get("/customers")

    return {
        props: {
            branchesFSSP: branchesFSSP.data,
            categoriesFSSP: categoriesFSSP.data,
            customersFSSP: customersFSSP.data
        }
    }
})