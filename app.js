const express = require('express');

const app = express();
app.use(express.json());

const Routes = require('./interfaces/routes/routes.js');
app.use('/pdf-docs', Routes);

app.listen(2205, ()=>{
    console.log("Server Iniciado na Porta 2205");
})
