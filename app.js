import express from 'express';

import {pool} from './config/db.js';


const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Define routes here
app.get('/users', async (req, res) => {
    
    try {
        const connection = await pool.getConnection();
        const sql = 'SELECT * FROM clientes'
        const [rows, fields] = await connection.query(sql);
        // console.log("FIELDS -->", fields)
        connection.release();
        res.json(rows);
    } catch (err) {
        console.error('Hubo un error al consultar la base de datos:', err);
        res.status(500).send('Hubo un error al consultar la base de datos');
    }
});


    app.get('/users/:idclientes', async (req, res) => {
        try {
            const connection = await pool.getConnection();
            const id = req.params.id
            const sql = 'SELECT * FROM clientes WHERE idclientes = ?';

            const [rows, fields] = await connection.query(sql, [id]);
            connection.release();
            if (rows.length === 0) {
                res.status(404).send('User not found');
            } else {
                res.json(rows[0]);
            }
        } catch (err) {
            console.error('Hubo un error al consultar la base de datos:', err);
            res.status(500).send('Hubo un error al consultar la base de datos');
        }
    });

//crear un nuevo usuario
app.post('/users', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const {nombre, apellido, email, password, rol} = req.body;

        const userData = req.body; // toma la info del formulario
  
        const sql = 'INSERT INTO clientes SET ?'; // (nombre, apellido, email, password, rol) VALUES (?, ?, ?, ?)';
        const [rows] = await connection.query(sql, [userData]);;
        connection.release();
        res.json({mensaje: 'Cliente creado', idclientes: rows.insertId});
       // res.redirect('/users.html' + "?mensaje=Usuario creado");
    } catch (err) {
        console.error('Hubo un error al consultar la base de datos:', err);
        res.status(500).send('Hubo un error al consultar la base de datos');
    }
    
});

app.get('/', (req, res) => {
    // Get all users
});




    app.get('/users/:idclientes', async (req, res) => {
        try {
            const connection = await pool.getConnection();
            const id = req.params.id;
            const userData = req.body; // toma la info del formulario

            const sql = 'UPDATE clientes SET ? WHERE id = ?';
            const [rows] = await connection.query(sql, [userData, id]);
            connection.release();
            res.json({ mensaje: 'Cliente actualizado' });
        } catch (err) {
            console.error('Hubo un error al consultar la base de datos:', err);
            res.status(500).send('Hubo un error al consultar la base de datos');
        }
    });


app.get('/users/borrar/:idclientes', async (req, res) => {
    
        try {
            const connection = await pool.getConnection();
            const id = req.params.id;
            const sql = 'DELETE FROM clientes WHERE idclientes = ?';
            const [rows] = await connection.query(sql, [id]);
            connection.release();
            if (rows.affectedRows === 0) {
                res.status(404).send('User not found');
            } else {
                res.json({ mensaje: 'Cliente eliminado' });
            }
        } catch (err) {
            console.error('Hubo un error al consultar la base de datos:', err);
            res.status(500).send('Hubo un error al consultar la base de datos');
        }
 
});

/*app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
*/
const port = process.env.PORT || 3000;

app.listen(port, (err) => {
  if (err) {
    console.error('Error al iniciar el servidor:', err);
  } else {
    console.log(`Servidor corriendo en http://localhost:${port}`);
  }
});



