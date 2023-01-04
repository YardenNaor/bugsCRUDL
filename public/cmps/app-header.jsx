const { NavLink } = ReactRouterDOM
const {  useEffect, useState } = React

import { UserMsg } from './user-msg.jsx'

import { userService } from '../services/user.service.js'
import { LoginSignup } from './login-signup.jsx'

export function AppHeader() {

  const [user,setUser]  = useState(userService.getLoggedinUser())

  function onChangeLoginStatus(user){
        setUser(user)
    }
  

  function onLogout() {
    userService.logout()
        .then(()=>{
            setUser(null)
        })
}

    useEffect(() => {
        // component did mount when dependancy array is empty
    }, [])

    return  <header>
            <UserMsg />
            <nav>
                <NavLink to="/">Home</NavLink> |
                <NavLink to="/bug">Bugs</NavLink> |
                <NavLink to="/about">About</NavLink>
            </nav>
            <h1>Bugs are Forever</h1>
            {user ? (
                < section >
                    <h2>Hello {user.fullname}</h2>
                    <button onClick={onLogout}>Logout</button>
                </ section >
            ) : (
                <section>
                    <LoginSignup onChangeLoginStatus={onChangeLoginStatus} />
                </section>
            )}
        </header>
    
}
