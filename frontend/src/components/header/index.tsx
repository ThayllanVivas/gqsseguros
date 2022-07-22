import Link from 'next/link'
import STYLES from './header.module.scss'
import { api } from '../../services/api'
import { FiLogOut} from 'react-icons/fi'
import { AuthContext, signOut } from '../../contexts/AuthContext'
import { useContext, useEffect, useState } from 'react'
import { Console } from 'console'

type UserInfoType = {
    id: string,
    name: string,
    email: string,
    admin_mode: boolean
}

export function Header({activePage}){

    const [userInfo, setUserInfo] = useState<UserInfoType>()

    const {searchInfo, setSearchInfo} = useContext(AuthContext)

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
                <input 
                    type="text"
                    placeholder="Pesquisar tarefa..."
                    id={STYLES.logoInput}
                    value={searchInfo}
                    onChange={(e) => {
                        setSearchInfo(e.target.value)
                    }}
                />
            </div>

            <nav id={STYLES.menuNav}>
                <Link href="/dashboard">
                    <a className={activePage === 'dashboardPage' ? STYLES.dashboardPageActive : undefined}>Início</a>
                </Link>

                <Link href="/newtask">
                    <a className={activePage === 'newTaskPage' ? STYLES.taskPageActive : undefined}>Nova tarefa</a>
                </Link>

                <Link href="/newcustomer">
                    <a className={activePage === 'customerPage' ? STYLES.customerPageActive : undefined}>Clientes</a>
                </Link>

                {userInfo?.admin_mode && (
                    <Link href="/newuser">
                        <a className={activePage === 'newUserPage' ? STYLES.newUserPageActive : undefined}>Usuários</a>
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