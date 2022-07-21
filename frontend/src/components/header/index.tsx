import Link from 'next/link'
import STYLES from './header.module.scss'
import { api } from '../../services/api'
import { FiLogOut} from 'react-icons/fi'
import { signOut } from '../../contexts/AuthContext'
import { useEffect, useState } from 'react'

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
        <header id={STYLES.headerContainer}>
            <div id={STYLES.logoNav}>
                <Link href="/dashboard">
                    <img id={STYLES.logo} src="./logo.png" width={40} height={46}/>
                </Link>
                {/* <input 
                    type="text"
                    placeholder="Pesquisar tarefa..."
                    id={STYLES.logoInput}
                    value={taskNameSearch}
                    onChange={(e) => setTaskNameSearch(e.target.value)}
                /> */}
            </div>
            <nav id={STYLES.menuNav}>
                <Link href="/dashboard">
                    <a className={activePage === 'dashboardPage' ? STYLES.dashboardPageActive : undefined}>Início</a>
                </Link>

                <Link href="/newcustomer">
                    <a className={activePage === 'customerPage' ? STYLES.customerPageActive : undefined}>Novo cliente</a>
                </Link>

                <Link href="/newtask">
                    <a className={activePage === 'newTaskPage' ? STYLES.taskPageActive : undefined}>Nova tarefa</a>
                </Link>

                {userInfo?.admin_mode && (
                    <Link href="/newuser">
                        <a className={activePage === 'newUserPage' ? STYLES.newUserPageActive : undefined}>Novo usuário</a>
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