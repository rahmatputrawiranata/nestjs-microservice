import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import io from 'socket.io-client'
import { useNavigate, Route, Routes, Link, redirect } from 'react-router-dom';

const SERVER_URL = `${process.env.REACT_APP_SERVER_BE_HOST}:${process.env.REACT_APP_SERVER_BE_PORT}`
const SOCKET_URL = `localhost:8005`
const socket = io(`${SOCKET_URL}`, {
  auth: {
    token: localStorage.getItem('token')  
  }
})

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
      </Routes>
    </div>
  );
}

const HomePage = () => {
  const token = localStorage.getItem('token')
  const user_id = localStorage.getItem('user_id')
  const navigate = useNavigate()
  const [data, setData] = useState<{title: string}[]>([])
  const loader = () => {
    if (!token && !user_id) {
      navigate('/login')
    }
  };

  useEffect(() => {
    if(!user_id) {
      loader()
    }else{
      socket.emit('join', user_id)
    }
  }, [])

  useEffect(() => {
    socket.on('receivedNotification', (item) => {
      console.log(item)
      setData([...data, {title: JSON.parse(item)?.title}])
    })
  })

  return (
    <div>
      <h1>Notification</h1>
      <ul>
        {
          data.map( x => (
            <li>{x.title}</li>
          ))
        }
      </ul>
    </div>
  )
}

const setUser = async() => {
  const token = localStorage.getItem('token')
  const res = await fetch(SERVER_URL + '/auth/profile', {
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json',
      'Accept': 'applocation/json'
    }
  })
  const resp = await res.json()
  localStorage.setItem('user_id', resp.resp_data.user_id)
}

function LoginPage() {
  
  const navigate = useNavigate()

  const handleSubmit = async(event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault()
    
    const form = event.currentTarget
    const formElements = form.elements as typeof form.elements & {
      email: {value: string}
      password: {value: string}
    }

    const res = await fetch(SERVER_URL + '/auth/login', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: formElements.email.value,
        password: formElements.password.value
      })
    })

    const resp = await res.json()

    if(res.status !== 200) {
      alert(resp.message)
    }else{
      localStorage.setItem('token', resp.resp_data.access_token)
      await setUser()
      navigate('/')
    }

  }
  return(
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Email: <input name="email" id="email" type="email"/>
        </label><br/>
        <label>
          Password: <input name="password" id="password" type="password"/>
        </label><br/>
        <button type='submit'>Login</button> <br />
        <Link to='/register'>Register</Link>
      </form>
    </div>
  )
}

function RegisterPage() {
  const navigate = useNavigate()
  const handleSubmit = async(event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const formElements = form.elements as typeof form.elements & {
      name: {value: string}
      email: {value: string}
      password: {value: string}
    }

    const res = await fetch(SERVER_URL + '/auth/register', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: formElements.name.value,
        email: formElements.email.value,
        password: formElements.password.value
      })
    })
    

    const resp = await res.json()

    if(res.status !== 200) {
      alert(resp.message)
    }else{
      localStorage.setItem('token', resp.resp_data.access_token)
      await setUser()
      navigate('/')
    }

  }
  return(
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Name: <input name="name" id="name" type="text" required/>
        </label><br/>
        <label>
          Email: <input name="email" id="email" type="email" required/>
        </label><br/>
        <label>
          Password: <input name="password" id="password" type="password" required/>
        </label><br/>
        <button type='submit'>Register</button><br />
        <Link to='/login'>Login</Link>
      </form>
    </div>
  )
}

export default App;
