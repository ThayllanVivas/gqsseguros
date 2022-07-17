import Link from 'next/link'
import Styles from './header.module.scss'
import { FiLogOut} from 'react-icons/fi'
import { signOut } from '../../contexts/AuthContext'
import { useEffect, useState } from 'react'
import { api } from '../../services/apiClient'

type UserInfoType = {
    id: string,
    name: string,
    email: string,
    admin_mode: boolean
}

export function Header({activePage}){

    const [userInfo, setUserInfo] = useState<UserInfoType>()

    const [taskNameSearch, setTaskNameSearch] = useState('')

    // to get USER info
    useEffect(() => {
        async function toGetUserInfo(){
            const response = await api.get('/me')

            setUserInfo(response.data)
        }

        toGetUserInfo()
    }, [])

    return (
        <header id={Styles.headerContainer}>
            <div id={Styles.logoNav}>
                <Link href="/dashboard">
                    <img id={Styles.logo} src="./logo.png" width={40} height={46}/>
                </Link>
                <input 
                    type="text"
                    placeholder="Pesquisar tarefa..."
                    id={Styles.logoInput}
                    value={taskNameSearch}
                    onChange={(e) => setTaskNameSearch(e.target.value)}
                />
            </div>
            <nav id={Styles.menuNav}>
                <Link href="/dashboard">
                    <a className={activePage === 'dashboardPage' ? Styles.dashboardPageActive : undefined}>Início</a>
                </Link>

                <Link href="/newcustomer">
                    <a className={activePage === 'customerPage' ? Styles.customerPageActive : undefined}>Novo cliente</a>
                </Link>

                <Link href="/newtask">
                    <a className={activePage === 'newTaskPage' ? Styles.taskPageActive : undefined}>Nova tarefa</a>
                </Link>

                {userInfo?.admin_mode && (
                    <Link href="/signup">
                        <a className={activePage === 'signUpPage' ? Styles.signUpPageActive : undefined}>Novo usuário</a>
                    </Link>
                )}     

                <button onClick={signOut}>     
                    <p>{userInfo?.name.toLocaleUpperCase()}</p>   
                    <FiLogOut />
                </button>       
            </nav>
        </header>
    )
}