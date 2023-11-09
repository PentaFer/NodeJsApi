import  express from 'express'
import personaRoutes from './routes/persona.routes.js';

import {PORT} from './config.js'

import indexRoutes from './routes/index.routes.js';


const app = express()

app.use(express.json())



app.use(indexRoutes)

app.use("/api",personaRoutes)



app.listen(PORT)

