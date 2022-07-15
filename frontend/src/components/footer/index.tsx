import { useEffect, useState } from 'react'
import { api } from '../../services/apiClient'
import styles from './footer.module.scss'

type UserInfo = {
    id: string;
    name: string;
    email: string;
}

export function Footer(){   
    const [userInfo, setUserInfo] = useState<UserInfo>()

    useEffect(() => {
        async function userInfo(){
            const response = await api.get('/me')
            
            setUserInfo(response.data.user)
        }

        userInfo()
    }, [])

    return (
        <footer className={styles.fixarRodape}>
            <p>{userInfo?.name.toLocaleUpperCase()}</p>
        </footer>
    )
}