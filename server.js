const express = require('express');
const app = express();
const path = require('path')
const PORT = process.env.PORT || 3500;




// using built-in  middlewares
app.use(express.urlencoded({ extended: false }))

//built-in middlewarefor json 
app.use(express.json());

// Middleware to serve static files (eg, css)
app.use(express.static(path.join(__dirname, '/public')));

// #express also accepts regx .... the (.html)? makes the extenion optional when searching on webpages
app.get('^/$|/index(.html)?', (req, res) => {
    // res.sendFile('./views/index.html', { root: __dirname });
    res.sendFile(path.join(__dirname, 'views', 'index.html'))
})

app.get('/new-page(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'new-page.html'));
    
})
app.get('/img1(.jpg)?', (req, res) => {
    res.sendFile(path.join(__dirname, 'img', 'img1.jpg'));
    
})

// Handling redirect with Expressjs
app.get('/old-page(.html)?', (req, res) => {
    res.redirect(301, './new-page.html'); // Sends 302 by default
})

// Set default get, or catch all
app.get('/*', (req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));