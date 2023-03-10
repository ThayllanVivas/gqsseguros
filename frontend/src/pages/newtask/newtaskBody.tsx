// -- START OF IMPORTS -- //
import Router from "next/router";
import Styles from './newtask.module.scss';
import { api } from '../../services/api';
import { toast } from "react-toastify";
import { NewTaskProps } from "../../contexts/TypesAndInterfaces";
import { useState, FormEvent, useEffect } from 'react'

export function Body({categoriesFSSP, branchesFSSP, customersFSSP}: NewTaskProps){

    const [branches, setBranches] = useState(branchesFSSP)
    const [categories, setCategories] = useState(categoriesFSSP)
    const [constumers, setConstumers] = useState(customersFSSP)

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
        setCategoryCREATEButton(categoriesFSSP[Number(categorySelected)-1]?.name)
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

        Router.push('/dashboard')

        
    }

    return (
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
    )
}