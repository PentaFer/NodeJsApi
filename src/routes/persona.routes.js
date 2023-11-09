import { Router } from "express";
import { deletePersona, getPersona, insertPersona, updatePersona, getPersonaById } from "../controller/personaController.js";


const router = Router()


router.get('/persona', getPersona)

router.get('/persona/:id', getPersonaById)


router.post('/registrar', insertPersona )

router.put('/actualizar', updatePersona)

router.delete('/eliminar/:id', deletePersona)

export default router

