// -- START OF IMPORTS -- //
import Head from "next/head";
import Styles from './newtask.module.scss'
import { toast } from "react-toastify";
import { Header } from "../../components/header";
import { canSSRAuth } from "../../utils/canSSRAuth";
import { setupAPIClient } from "../../services/api";
import { useState, FormEvent, useEffect } from 'react'
import { Footer } from "../../components/footer";

// -- START OF INTERFACES AND TYPES -- //
interface ListKind {
    branchList: ItemBranchTypes[];
    categoryList: ItemCategoryTypes[];
    customerList: ItemConsumerTypes[];
}

type ItemConsumerTypes = {
    id: string;
    cpf: string;
    name: string;
    phoneNumber: string;
}

type ItemCategoryTypes = {
    id: string;
    name: string;
}

type ItemBranchTypes = {
    id: string;
    name: string;
}

// -- START OF THE COMPONENT -- //
export default function product({categoryList, branchList, customerList}: ListKind) {

    const [branches, setBranches] = useState(branchList)
    const [categories, setCategories] = useState(categoryList)
    const [constumers, setConstumers] = useState(customerList)

    const [description, setDescription] = useState('')

    const [vehicleYear, setVehicleYear] = useState('')
    const [vehicleName, setVehicleName] = useState('')
    const [vehiclePrice, setVehiclePrice] = useState('')

    const [branchSelected, setBranchSelected] = useState<string>()
    const [customerSelected, setCustomerSelected] = useState<string>()
    const [categorySelected, setCategorySelected] = useState<string>()

    const [categoryCREATEButton, setCategoryCREATEButton] = useState('')
    const [styleCREATEButton, setStyleCREATEButton] = useState(false)

    useEffect(() => {
        setCategoryCREATEButton(categoryList[Number(categorySelected)-1]?.name)
    }, [categorySelected])

    useEffect(() => {
        if( vehicleYear == '' || 
            vehicleName == '' || 
            vehiclePrice == '' || 
            branchSelected == '' || 
            customerSelected == '' || 
            categorySelected == '' )
        {
            setStyleCREATEButton(false)
        } else {
            setStyleCREATEButton(true)
        }
        
    }, [vehicleYear, vehicleName, vehiclePrice, branchSelected, customerSelected, categorySelected])

    // function to DEFINE the category
    function handleChangeCategory(event){
        setCategorySelected(event.target.value)
    }

    // function to DEFINE the branch
    function handleChangeBranch(event){
        setBranchSelected(event.target.value)
    }

    // function to DEFINE the constumer
    function handleChangeConsumer(event){
        setCustomerSelected(event.target.value)
    }

    // function to CREATE the task
    async function handleCreateTask(event: FormEvent){
        event.preventDefault()

        let selectedBranch = (document.getElementById("selectBranch") as HTMLInputElement).value
        let selectedCategory = (document.getElementById("selectCategory") as HTMLInputElement).value
        let selectedCustomer = (document.getElementById("selectCustomer") as HTMLInputElement).value

        if( vehicleYear === '' || 
            vehicleName === "" ||  
            vehiclePrice === "" || 
            selectedCategory === "--Selecione uma categoria--" || 
            selectedCustomer === "--Selecione um cliente--" || 
            selectedBranch === "--Selecione um ramo--"){
                toast.error("Preencher os campos")
                return;
        }

        try {
            const api = setupAPIClient()
            await api.post("/task", {
                description: description,
                vehicleName: vehicleName,
                vehicleYear: vehicleYear,
                vehiclePrice: vehiclePrice,
                branch_id: branchSelected,
                category_id: categorySelected,
                customer_id: customerSelected,
            })

            toast.success("Tarefa criada com sucesso")
        } catch (err) {
            toast.error("Erro ao criar tarefa")
            return;
        }

        setDescription("")
        setVehicleName("")
        setVehicleYear("")
        setVehiclePrice("")
        setBranchSelected('')
        setCategorySelected('')
    }

    // --- RETURN --- //
    return (
        <>
            <Head>
                <title>Nova categoria - Sujeito Pizza</title>
            </Head>
            <Header activePage='newTaskPage' />

            <main className={Styles.container}>
                <h1>Novo tarefa</h1>
            
                <form className={Styles.form} onSubmit={handleCreateTask}>

                    <select id="selectCategory" defaultValue={"default"} onChange={() => handleChangeCategory(event)}  className={Styles.select} >
                        <option key="default" value="--Selecione uma categoria--">
                        -- Selecione uma categoria --
                        </option>
                        {categories.map( (category, index) => { 
                            return (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            )
                        })}
                    </select>

                    <select id="selectBranch" defaultValue={"default"} onChange={() => handleChangeBranch(event)}  className={Styles.select} >
                        <option key="default" value="--Selecione uma ramo--">
                        -- Selecione um ramo --
                        </option>
                        {branches.map( (branch, index) => { 
                            return (
                                <option key={branch.id} value={branch.id}>
                                    {branch.name}
                                </option>
                            )
                        })}
                    </select>

                    <select id="selectCustomer" defaultValue={"default"} onChange={() => handleChangeConsumer(event)}  className={Styles.select} >
                        <option key="default" value="--Selecione um cliente--">
                        -- Selecione um cliente --
                        </option>
                        {constumers.map( (constumer, index) => { 
                            return (
                                <option key={constumer.id} value={constumer.id}>
                                    {constumer.name}
                                </option>
                            )
                        })}
                    </select>

                    <input 
                        type="text"
                        placeholder="Digite o nome do veiculo"
                        className={Styles.input}
                        value={vehicleName}
                        onChange={(e) => {
                            setVehicleName(e.target.value) 
                        }}
                    />

                    <input 
                        type="text"
                        placeholder="Digite o ano do veiculo"
                        className={Styles.input}
                        value={vehicleYear}
                        onChange={(e) => {
                            setVehicleYear(e.target.value) 
                        }}
                    />

                    <input 
                        type="text"
                        placeholder="Digite o preço (tabela FIPE) do veículo"
                        className={Styles.input}
                        value={vehiclePrice}
                        onChange={(e)=> {
                            setVehiclePrice(e.target.value)

                        }}
                    />

                    <textarea 
                        className={Styles.textarea} 
                        placeholder="Insira detalhes sobre o seguro"
                        value={description}
                        onChange={(e)=> {
                            setDescription(e.target.value)
                        }}
                    />

                    <button className={styleCREATEButton? Styles.buttonAdd : Styles.buttonAddDisabled} type="submit">
                        Criar {categoryCREATEButton || 'Tarefa'}
                    </button>
                    

                </form>
            </main>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async(ctx) => {
    const api = setupAPIClient(ctx)

    const branchList = await api.get("/branch")
    const categoryList = await api.get("/category")
    const customerList = await api.get("/customer")

    return {
        props: {
            branchList: branchList.data,
            categoryList: categoryList.data,
            customerList: customerList.data
        }
    }
})