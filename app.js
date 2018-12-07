// Define variables and require modules
const mongoose = require('mongoose'), express = require('express'), app = express(), bodyParser = require('body-parser');
let db = mongoose.connection;
require('dotenv').config();  
const favicon = require('serve-favicon'), path = require('path'); app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
// app.use(express.favicon('/favicon.ico'));
//config hbars
const exphbs = require('express-handlebars'); app.set('views', './views'); app.engine('handlebars', exphbs({defaultLayout: 'main'})); app.set('view engine', 'handlebars'); app.use(express.static('views/images'));

// Connect to the db @ MLAB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });
//console.log(mongoose.connection);
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() { console.log("We're connected to mongo!")

    // Define our Schema & Model
    let countSchema = new mongoose.Schema( {num: Number} );  
    let CountModel = mongoose.model('Count', countSchema);

    // Create our first document
    // let count = new CountModel({ num: '0' });

    // count.save(function (err, count) {
    //     if (err) return console.error(err);
    //     console.log(count);
    // });

    // // Return all objects in the model
    // CountModel.find(function (err, kittens) {
    //     if (err) return err;
    //     console.log(kittens);
    // })





    /// Define our routes
    // homepage
    app.get('/', function (req, res) {
        CountModel.find(
            { num: {$exists: true} }, //the query object
            function (err, doc) { //the cb
                if (err) res.send(err);
                let total = doc[0].num;
                res.render('home', { title: total }); //res.render is for templates (anything nonhtml)
            });
    })



    // click button, increments doc, redirects to home.
    app.post('/', function (req, res) {
        // res.send('success');

        CountModel.findOneAndUpdate(
            { num: {$exists: true} }, //finds the doc
            { $inc: { num: 1 } }, //updates the doc, increments by 1.
            { new: true }, //options argument. returns updated doc not original.
            function (err, doc) { //4th arg: callback function with error and returned doc
            
            if (err) res.send(err);
            // res.send(`${doc.num}`);
            res.redirect('/');
        })
    })


    //resets counter
    app.post('/reset', function (req, res) {
        CountModel.findOneAndUpdate(
            { num: {$exists: true} }, 
            { num: 0 } , //resets counter to 0.
            { new: true }, 
            function (err, doc) { 
                
            if (err) res.send(err);
            res.redirect('/');
        })
    })


    // Opens up localhost:3000
    app.listen(process.env.PORT || 3000, () => console.log(`App listening on port 3000!`))
});