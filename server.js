const express = require('express');
const app = express();
const path = require('path')
const { logger } = require('./middleware/logEvents');
const  errorHandler  = require('./middleware/errorHandler');
const cors = require('cors');
const PORT = process.env.PORT || 3500;

// Custom Middleware logger
app.use(logger);

// cors => Cross Origin Resource Sharing
const whitelist = ["https://www.google.com", 'http://127.0.0.1:5500', 'http://localhost:3500'] // domains to be able to access your backend servers.

// function for cors to allow access
const corsOption = {
    origin: (origin, callback) => {
        if(whitelist.indexOf(origin) !== -1 || !origin){
            callback(null, true);
        }else{
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionSuccessStatus: 200
}

app.use(cors(corsOption));

// using built-in  middlewares
app.use(express.urlencoded({ extended: false }))

//built-in middlewarefor json 
app.use(express.json());

// Middleware to serve static files (finds the static files and applies them.. eg, css)
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

// Route Handlers
app.get('/hello(.html)?', (req, res, next) => {
    console.log(`attempted to load hello.html`);
    next();
}, (req, res) => {
    res.send("Hello Dev")
})

// Chaining route handlers
const one = (req, res, next) => {
    console.log('one');
    next();
}
const two = (req, res, next) => {
    console.log('two');
    next();
}
const three = (req, res, next) => {
    console.log('three');
    next();
}

app.get('/chain(.html)?', [one, two, three])


// Set default get, or catch all
app.all('*', (req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
})

// Custom error handling (though, espress has a built-in error handler)
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));