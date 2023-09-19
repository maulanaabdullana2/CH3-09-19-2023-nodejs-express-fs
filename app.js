const fs = require('fs')
const express = require('express')
const app = express()

const port = process.env.port||3000 
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`))

app.use(express.json())


//merubah data Tour
app.patch('/api/v1/tours/:id', (req, res) => {
    const id = req.params.id * 1;
    // findIndex = -1 (kalau data nya gk ada)
    const tourIndex = tours.findIndex(el => el.id === id)

    if(tourIndex === -1) {
        return res.status(404).json({
            status: 'failed',
            message: `data with ${id} this not found`
        })
    }

    tours[tourIndex] = {...tours[tourIndex], ...req.body}

    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        res.status(200).json({
            status: 'success',
            message: `tour with this id ${id} edited`,
            data: {
                tour: tours[tourIndex]
            }
        })
    })
})


//Delete Data
app.delete('/api/v1/tours/:id',(req,res)=>{
    const id = req.params.id * 1 

    const tourindex = tours.findIndex(el => el.id === id);
    if(tourindex === -1){
        return res.status(404).json({
            status: 'filed',
            message: 'Data Not Found'
        })
    }

    tours.splice(tourindex, 1)

    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`,JSON.stringify(tours),err => {
        res.status(200).json({
            status:'sucess',
            message: 'Berhasil Delete Data',
            data: null
        }
        )
    })
})

//Get all Data
app.get('/api/v1/tours', (req,res)=>{
    res.status(200).json({
        status: 'sucess',
        data: {
            tours
        }
    })
})


//get Cars id
app.get('/api/v1/tours/:id', (req, res) => {
    const id = req.params.id * 1;
    const tour = tours.find((el) => el.id === id);
  
    if (!tour) {
      return res.status(404).json({
        status: `failed`,
        message: `data with ${id} this not found`,
      });
    }
    res.status(200).json({
      status: `success`,
        data: {
          tour,
         },
    });
  });


//Post Data 
app.post('/api/v1/tours',(req,res)=>{
    const newId = tours[tours.length - 1].id + 1
    const newdata = Object.assign({id:newId}, req.body);

    tours.push(newdata)
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err=>{
        res.status(201).json({
            message : '200',
            data:{
                tour:newdata
            }
        })
    })
})

app.listen(port,()=>{
    console.log(`App Running on Port ${port}...`);
})