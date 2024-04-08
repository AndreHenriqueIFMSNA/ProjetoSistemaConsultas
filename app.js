const express = require('express');
const handlebars = require('handlebars');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/views/layout'));

app.engine('handlebars', (filePath, options, callback) => {
  fs.readFile(filePath, (err, content) => {
    if (err) return callback(err);
    const template = handlebars.compile(content.toString());
    return callback(null, template(options));
  });
});
app.set('view engine', 'handlebars');

let consultas = [];

app.get('/', (req, res) => {
  res.render('index');
});


app.get('/consultas', (req, res) => {
  res.render('listarConsultas');
});

app.get('/cadastrarConsultas/', (req, res) => {
    res.render('cadastrarConsultas');
});

app.get('/listarConsultas', (req, res) =>{
    res.render('listarConsultas');
})

app.get('/consultas/new', (req, res) => {
  res.render('new');
});

app.post('/cadastrarConsultas/', (req, res) => {
  const { paciente, data, hora } = req.body;
  const consulta = { paciente, data, hora };
  consultas.push(consulta);
  res.redirect('/listarConsultas');
});

app.get('/consultas/:id', (req, res) => {
  const id = req.params.id;
  const consulta = consultas[id];
  res.render('show', { consulta });
});

app.get('/consultas/:id/edit', (req, res) => {
  const id = req.params.id;
  const consulta = consultas[id];
  res.render('edit', { consulta, id });
});


app.post('/consultas/:id', (req, res) => {
  const id = req.params.id;
  const { paciente, data, hora } = req.body;
  consultas[id] = { paciente, data, hora };
  res.redirect('/');
});

app.post('/consultas/:id/delete', (req, res) => {
  const id = req.params.id;
  consultas.splice(id, 1);
  res.redirect('/');
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
