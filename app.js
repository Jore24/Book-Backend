import dotenv from 'dotenv';
import cors from 'cors';
import express from 'express';
import { pool } from './db.js';

dotenv.config();


// Configuración del servidor Express
const app = express();
const port = 3000; // Puedes cambiar el puerto si es necesario
app.use(cors());

app.use(cors({
  origin: 'http://example.com', // Permite solicitudes solo desde http://example.com
  methods: 'GET,POST,PUT,DELETE', // Permite solo los métodos GET, POST, PUT y DELETE
  allowedHeaders: 'Content-Type,Authorization' // Permite solo ciertas cabeceras
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/products', async (req, res) => {
  try {
    // Verificar la conexión a la base de datos
    const [rows, fields] = await pool.query('SELECT * FROM products');
    // Imprimir resultados
    console.log(rows);
    console.log('Conexión exitosa a la base de datos.');
    res.json(rows); // Enviamos la respuesta JSON con los datos de la consulta
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
    res.status(500).send('Error al conectar a la base de datos');
  }
});
//por categoria a la base de datos recibe el id de la categoria
app.get('/products/:categoryId', async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    // Verificar la conexión a la base de datos
    const [rows, fields] = await pool.query('SELECT * FROM products WHERE CategoryId = ?', [categoryId]);
    // Imprimir resultados
    console.log(rows);
    console.log('Conexión exitosa a la base de datos.');
    res.json(rows); // Enviamos la respuesta JSON con los datos de la consulta
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
    res.status(500).send('Error al conectar a la base de datos');
  }
});


//registrar producto
app.post('/products', async (req, res) => {
  try {
    console.log(req.body)
    const newProduct = {
      CategoryId: req.body.CategoryId,
      title: req.body.title,
      author: req.body.author,
      year: req.body.year,
      publisher: req.body.publisher,
      description: req.body.description,
      status: req.body.status,
      image: req.body.image,
      price: req.body.price,
      created_at: new Date().toISOString().slice(0, 19).replace('T', ' ') // Utiliza la hora actual en formato 'YYYY-MM-DD HH:mm:ss'

      // Agrega aquí otros campos del producto según tu base de datos
    };
    const result = await pool.query('INSERT INTO products SET ?', newProduct);
    console.log('Producto agregado:', newProduct);
    res.status(201).json({ message: 'Producto agregado correctamente', productId: result.insertId });
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
    res.status(500).send('Error al conectar a la base de datos');
  }
});

//detalle de un producto por id 
app.get('/product/:productId', async (req, res) => {
  try {
    const productId = req.params.productId;
    const [rows, fields] = await pool.query('SELECT * FROM products WHERE ProductId = ?', [productId]);
    if (rows.length > 0) {
      console.log('Detalles del producto:', rows[0]);
      res.json(rows[0]);
    } else {
      res.status(404).send('Producto no encontrado');
    }
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
    res.status(500).send('Error al conectar a la base de datos');
  }
});

//actualizar un producto
app.put('/product/:productId', async (req, res) => {
  try {
    const productId = req.params.productId;
    // Aquí puedes obtener los datos actualizados del producto desde req.body
    // y luego actualizarlos en la base de datos
    // Por ejemplo:
    const updatedProduct = {
      title: req.body.title,
      author: req.body.author,
      // Agrega aquí otros campos del producto según tu base de datos
    };
    await pool.query('UPDATE products SET ? WHERE ProductId = ?', [updatedProduct, productId]);
    console.log('Producto actualizado:', updatedProduct);
    res.json({ message: 'Producto actualizado correctamente' });
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
    res.status(500).send('Error al conectar a la base de datos');
  }
});

//eliminar un producto
app.delete('/product/:productId', async (req, res) => {
  try {
    const productId = req.params.productId;
    await pool.query('DELETE FROM products WHERE ProductId = ?', [productId]);
    console.log('Producto eliminado:', productId);
    res.json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
    res.status(500).send('Error al conectar a la base de datos');
  }
});




// Agrega aquí tus demás rutas y lógica del servidor según tus necesidades

// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
