import React, {useState, useEffect} from 'react'
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Icon from '@mui/material/Icon'
import { makeStyles } from '@mui/styles'
import {authenticate, isAuthenticated, clearJWT} from './../auth/auth-helper'
import {read, update} from './api-user.js'
// import {Redirect} from 'react-router-dom'
import {Navigate, useParams} from 'react-router-dom'
import Avatar from '@mui/material/Avatar'
import FileUploadIcon from '@mui/icons-material/FileUpload'

const auth = {authenticate, isAuthenticated, clearJWT}

const useStyles = makeStyles(theme => ({
  card: {
    maxWidth: 600,
    margin: 'auto',
    textAlign: 'center',
    marginTop: theme.spacing(5),
    paddingBottom: theme.spacing(2)
  },
  title: {
    margin: theme.spacing(2),
    color: theme.palette.protectedTitle
  },
  error: {
    verticalAlign: 'middle'
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 300
  },
  submit: {
    margin: 'auto',
    marginBottom: theme.spacing(2)
  },
  bigAvatar: {
    width: 60,
    height: 60,
    margin: 'auto'
  },
  input: {
    display: 'none'
  },
  filename:{
    marginLeft:'10px'
  }
}))

export default function EditProfile() {
  const match = useParams()
  const classes = useStyles()
  const [values, setValues] = useState({
    name: '',
    about: '',
    photo: '',
    email: '',
    password: '',
    redirectToProfile: false,
    error: '',
    id: ''
  })
  const jwt = auth.isAuthenticated()

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    read({
      userId: match.userId
    }, {t: jwt.token}, signal).then((data) => {
      if (data && data.error) {
        setValues({...values, error: data.error})
      } else {
        setValues({...values, id: data._id, name: data.name, email: data.email, about: data.about})
      }
    })
    return function cleanup(){
      abortController.abort()
    }

  // }, [])
}, [])

  const clickSubmit = () => {
    let userData = new FormData()
    values.name && userData.append('name', values.name)
    values.email && userData.append('email', values.email)
    values.password && userData.append('password', values.password)
    values.about && userData.append('about', values.about)
    values.photo && userData.append('photo', values.photo)


    update({
      userId: match.userId
    }, {
      t: jwt.token
    }, userData).then((data) => {
      if (data && data.error) {
        setValues({...values, error: data.error})
      } else {
        setValues({...values, 'redirectToProfile': true})
      }
    })
  }


  const handleChange = name => event => {
    const value = name === 'photo'
      ? event.target.files[0]
      : event.target.value
    // userData.set(name, value)
    setValues({...values, [name]: value })
    // setValues({...values, [name]: event.target.value})
  }

  const photoUrl = values.id
  ? `/api/users/photo/${values.id}?${new Date().getTime()}`
  : '/api/users/defaultphoto'

    if (values.redirectToProfile) {
      return (<Navigate to={'/user/' + values.userId}/>)
    }

    return (
      <Card className={classes.card}>
      <CardContent>
        <Typography variant="h6" className={classes.title}>
          Редактировать профиль
        </Typography>
        <Avatar src={photoUrl} className={classes.bigAvatar} />
        <br />
        <input
          accept="image/*"
          onChange={handleChange("photo")}
          className={classes.input}
          id="icon-button-file"
          type="file"
        />
        <label htmlFor="icon-button-file">
          <Button 
          variant="contained" 
          // color="default" 
          component="span">
            Загрузить
            <FileUploadIcon />
          </Button>
        </label>{" "}
        <span 
        className={classes.filename}
        >
          {values.photo ? values.photo.name : ""}
        </span>

        <br />
        <TextField
          id="name"
          label="Имя"
          className={classes.textField}
          value={values.name}
          onChange={handleChange("name")}
          margin="normal"
        />
        <br />
        <TextField
          id="multiline-flexible"
          label="Обо мне"
          multiline
          rows="2"
          value={values.about}
          onChange={handleChange("about")}
          className={classes.textField}
          margin="normal"
        />
        <br />
        <TextField
          id="email"
          type="email"
          label="Email"
          className={classes.textField}
          value={values.email}
          onChange={handleChange("email")}
          margin="normal"
        />
        <br />
        <TextField
          id="password"
          type="password"
          label="Пароль"
          className={classes.textField}
          value={values.password}
          onChange={handleChange("password")}
          margin="normal"
        />
        <br />{" "}
        {values.error && (
          <Typography component="p" color="error">
            <Icon color="error" className={classes.error}>
              Ошибка
            </Icon>
            {values.error}
          </Typography>
        )}
      </CardContent>
      <CardActions>
        <Button
          color="primary"
          variant="contained"
          onClick={clickSubmit}
          className={classes.submit}
        >
          Отправить
        </Button>
      </CardActions>
    </Card>
    );
}

