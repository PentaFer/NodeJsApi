import { pool } from '../db.js';


export const getPersona = async (req, res) => {
    try {
      const [result] = await pool.query('SELECT * FROM persona');
  
      const personas = await Promise.all(result.map(async (persona) => {
        const [estadoCivilResult] = await pool.query('SELECT * FROM estadocivil WHERE id_estado_civil = ?', [persona.id_estado_civil]);
        const [tipoSeguroResult] = await pool.query('SELECT * FROM tiposeguro WHERE id_tipo_seguro = ?', [persona.id_tipo_seguro]);
  
        const estadoCivil = estadoCivilResult[0];
        const tipoSeguro = tipoSeguroResult[0];
  
        return {
          id_persona: persona.id_persona,
          nombre: persona.nombre,
          apellidoPaterno: persona.apellidoPaterno,
          apellidoMaterno: persona.apellidoMaterno,
          dni: persona.dni,
          correo: persona.correo,
          direccion: persona.direccion,
          numero_hijos: persona.numero_hijos,
          id_estado_civil: {
            id_estado_civil: estadoCivil.id_estado_civil,
            nombre: estadoCivil.nombre,
          },
          asegurado: persona.asegurado,
          id_tipo_seguro: {
            id_tipo_seguro: tipoSeguro.id_tipo_seguro,
            nombre: tipoSeguro.nombre,
          },
          sueldo: persona.sueldo,
          fechaDeNacimiento: persona.fechaDeNacimiento,
          fechaIngreso: persona.fechaIngreso,
        };
      }));
  
      res.json(personas);
    } catch (error) {
      console.error('Error al obtener personas:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };

  export const insertPersona = async (req, res) => {
    try {
      const {
        nombre,
        apellidoPaterno,
        apellidoMaterno,
        dni,
        correo,
        direccion,
        numero_hijos,
        id_estado_civil,
        asegurado,
        id_tipo_seguro,
        sueldo,
        fechaDeNacimiento,
        fechaIngreso,
      } = req.body;
  
      // Obtener el ID de estado civil
      const idEstadoCivil = id_estado_civil ? id_estado_civil.id_estado_civil : null;
  
      // Obtener el ID de tipo de seguro
      const idTipoSeguro = id_tipo_seguro ? id_tipo_seguro.id_tipo_seguro : null;
  
      const [rows] = await pool.query(
        'INSERT INTO persona (nombre, apellidoPaterno, apellidoMaterno, dni, correo, direccion, numero_hijos, id_estado_civil, asegurado, id_tipo_seguro, sueldo, fechaDeNacimiento, fechaIngreso) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          nombre,
          apellidoPaterno,
          apellidoMaterno,
          dni,
          correo,
          direccion,
          numero_hijos,
          idEstadoCivil,
          asegurado,
          idTipoSeguro,
          sueldo,
          fechaDeNacimiento,
          fechaIngreso,
        ]
      );
  
      console.log(rows);
      res.json({ message: 'Persona creada exitosamente', nuevaPersonaId: rows.insertId });
    } catch (error) {
      console.error('Error al insertar persona:', error);
      res.status(500).json({ error: 'Error interno del servidor', details: error.message });
    }
  };

  export const updatePersona = async (req, res) => {
    try {
      const {
        id_persona,
        nombre,
        apellidoPaterno,
        apellidoMaterno,
        dni,
        correo,
        direccion,
        numero_hijos,
        id_estado_civil,
        asegurado,
        id_tipo_seguro,
        sueldo,
        fechaDeNacimiento,
        fechaIngreso,
      } = req.body;
  
      // Verificar si la persona existe antes de intentar actualizar
      const [existingPersona] = await pool.query('SELECT * FROM persona WHERE id_persona = ?', [id_persona]);
      if (existingPersona.length === 0) {
        return res.status(404).json({ error: 'Persona no encontrada' });
      }
  
      // Obtener el ID de estado civil por nombre
      const [estadoCivilResult] = await pool.query('SELECT id_estado_civil FROM estadocivil WHERE nombre = ?', [id_estado_civil.nombre]);
      const idEstadoCivil = estadoCivilResult.length > 0 ? estadoCivilResult[0].id_estado_civil : existingPersona[0].id_estado_civil;
  
      // Obtener el ID de tipo de seguro por nombre
      const [tipoSeguroResult] = await pool.query('SELECT id_tipo_seguro FROM tiposeguro WHERE nombre = ?', [id_tipo_seguro.nombre]);
      const idTipoSeguro = tipoSeguroResult.length > 0 ? tipoSeguroResult[0].id_tipo_seguro : existingPersona[0].id_tipo_seguro;
  
      // Realizar la actualización en la base de datos
      await pool.query(
        'UPDATE persona SET nombre=?, apellidoPaterno=?, apellidoMaterno=?, dni=?, correo=?, direccion=?, numero_hijos=?, id_estado_civil=?, asegurado=?, id_tipo_seguro=?, sueldo=?, fechaDeNacimiento=?, fechaIngreso=? WHERE id_persona=?',
        [
          nombre,
          apellidoPaterno,
          apellidoMaterno,
          dni,
          correo,
          direccion,
          numero_hijos,
          idEstadoCivil,
          asegurado,
          idTipoSeguro,
          sueldo,
          fechaDeNacimiento,
          fechaIngreso,
          id_persona,
        ]
      );
  
      res.json({ message: 'Persona actualizada exitosamente' });
    } catch (error) {
      console.error('Error al actualizar persona:', error);
      res.status(500).json({ error: 'Error interno del servidor', details: error.message });
    }
  };
  export const deletePersona = async (req,res)=> {
  const [result] = await pool.query('DELETE FROM persona WHere id_persona = ?',[req.params.id])
  console.log(result);

  if(result.affectedRows<=0){
    return res.status(404).json({
      message : "Persona no encontrada"
    })
  }


  res.sendStatus(204)
}

export const getPersonaById = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT persona.*, estadocivil.nombre as nombre_estado_civil, tiposeguro.nombre as nombre_tipo_seguro FROM persona ' +
      'LEFT JOIN estadocivil ON persona.id_estado_civil = estadocivil.id_estado_civil ' +
      'LEFT JOIN tiposeguro ON persona.id_tipo_seguro = tiposeguro.id_tipo_seguro ' +
      'WHERE persona.id_persona = ?',
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Persona no encontrada' });
    }

    const persona = {
      id_persona: rows[0].id_persona,
      nombre: rows[0].nombre,
      apellidoPaterno: rows[0].apellidoPaterno,
      apellidoMaterno: rows[0].apellidoMaterno,
      dni: rows[0].dni,
      correo: rows[0].correo,
      direccion: rows[0].direccion,
      numero_hijos: rows[0].numero_hijos,
      id_estado_civil: {
        id_estado_civil: rows[0].id_estado_civil,
        nombre: rows[0].nombre_estado_civil,
      },
      asegurado: rows[0].asegurado,
      id_tipo_seguro: {
        id_tipo_seguro: rows[0].id_tipo_seguro,
        nombre: rows[0].nombre_tipo_seguro,
      },
      sueldo: rows[0].sueldo,
      fechaDeNacimiento: rows[0].fechaDeNacimiento,
      fechaIngreso: rows[0].fechaIngreso,
    };

    res.json(persona);
  } catch (error) {
    console.error('Error al obtener persona por ID:', error);
    res.status(500).json({ error: 'Error interno del servidor', details: error.message });
  }
};




