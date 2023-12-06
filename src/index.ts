import express from 'express'
import router from './router'
import bodyParser from 'body-parser'
import cors from 'cors'
import sequelize from './db/db'
import {auth} from 'express-oauth2-jwt-bearer'
require('dotenv').config()

const jwtCheck = auth({
	audience: process.env.AUTH0_AUDIENCE,
	issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
	tokenSigningAlg: 'RS256',
})

const app = express()
app.use(cors())
//app.use(jwtCheck)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

sequelize.sync().then(() => {
	console.log('Database synchronized')
	app.listen(3200, () => {
		console.log('Server listening on port 3200')
	})
})

router(app)
