const express = require('express')
const mongoose = require('mongoose')
// const router = express.Router();
const {ensureAuthenticated} = require('../helpers/auth');
const passport = require('passport');
const router = express.Router();

require('../models/Unit');
const Unit = mongoose.model('units');

require('../models/File');
const File = mongoose.model('files')

router.get('/igcse' , (req,res) => {
    res.json({subjects:[
        'mathematics',
        'physics',
        'chemistry',
        'biology',
        'computer science',
        'history',
        'geography',
        'business studies',
        'economics',
    ]})
})



router.get('/igcse/:subject', (req,res) => {
    Unit.find({subject: req.params.subject}).then(units => {
        res.send(units)
    })
})

/*
ADD subject
*/

router.post('/igcse/add', ensureAuthenticated, (req,res) => {
    let errors = []
    if(req.body.name == 0){
        errors.push({text:'No name'})
    }
    if(req.body.subject == 0){
        errors.push({text:"No subject"})
    }
    if(errors.length > 0){
        res.send({text:errors,error: true })
    }else {
        Unit.findOne({name:req.body.name}).then(unit => {
            console.log(unit)
            if(unit){
                res.send({text:"Unit already exist",error: true })
            }
            else{
                const newUnit = new Unit({
                    name: req.body.name,
                    subject: req.body.subject
                })
                newUnit.save().then(() => {
                    res.send({text:"unit saved",error: false })
                })
            }
        })
    }
})


router.get('/igcse/:subject/:unit', (req,res) => {
    File.find({unit:req.params.unit}).then(files => {
        res.send(files)
    })
})

//user routes




module.exports = router;
