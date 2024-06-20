const express = require('express');

const app = express();

app.get('/', (req, res)=>{
   res.status(200).json({message: 'Hello from to test server', App: 'Natours'});
});

app.post('/', (req, res)=>{
    res.json('Endpoint for sedning data');
 });

const port = 3000;
app.listen(port, () =>{
    console.log(`App runinng on port ${port}...`);
});