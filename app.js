const fs = require("fs")

const morgan = require("morgan")
const express = require("express")
const app = express()

app.use(express.json())
app.use(morgan("dev"))

app.use((req, res, next) => {
    req.requesTime = new Date().toISOString()
    next()
})

const port = process.env.port || 3000

//API TOURS
const tours = JSON.parse(
    fs.readFileSync(
        `${__dirname}/dev-data/data/tours-simple.json`
    )
)

const getAllTours = (req, res) => {
    res.status(200).json({
        status: "success",
        data: {
            requesTime: req.requesTime,
            tours,
        },
    })
}

const getToursById = (req, res) => {
    const id = req.params.id * 1
    const tour = tours.find((el) => el.id === id)

    if (!tour) {
        return res.status(404).json({
            status: "failed",
            message: `data with ${id} this not found`,
        })
    }

    res.status(200).json({
        status: "success",
        data: {
            tour,
        },
    })
}

const createTour = (req, res) => {
    const newId = tours[tours.length - 1].id + 1
    const newData = Object.assign(
        { id: newId },
        req.body
    )

    tours.push(newData)
    fs.writeFile(
        `${__dirname}/dev-data/data/tours-simple.json`,
        JSON.stringify(tours),
        (err) => {
            res.status(201).json({
                status: "success",
                data: {
                    tour: newData,
                },
            })
        }
    )
}

const editTour = (req, res) => {
    const id = req.params.id * 1
    const tourIndex = tours.findIndex(
        (el) => el.id === id
    )

    if (tourIndex === -1) {
        return res.status(404).json({
            status: "failed",
            message: `data with ${id} this not found`,
        })
    }

    tours[tourIndex] = {
        ...tours[tourIndex],
        ...req.body,
    }

    fs.writeFile(
        `${__dirname}/dev-data/data/tours-simple.json`,
        JSON.stringify(tours),
        (err) => {
            res.status(200).json({
                status: "success",
                message: `tour with this id ${id} edited`,
                data: {
                    tour: tours[tourIndex],
                },
            })
        }
    )
}

const deleteTour = (req, res) => {
    const id = req.params.id * 1

    const tourIndex = tours.findIndex(
        (el) => el.id === id
    )

    if (tourIndex === -1) {
        return res.status(404).json({
            status: "failed",
            message: "data not found",
        })
    }

    tours.splice(tourIndex, 1)

    fs.writeFile(
        `${__dirname}/dev-data/data/tours-simple.json`,
        JSON.stringify(tours),
        (err) => {
            res.status(200).json({
                status: "success",
                message: "berhasil delete data",
                data: null,
            })
        }
    )
}

//API USERS
const users = JSON.parse(
    fs.readFileSync(
        `${__dirname}/dev-data/data/users.json`
    )
)

const getAllusers = (req, res) => {
    res.status(200).json({
        status: "success",
        data: {
            requesTime: req.requesTime,
            users,
        },
    })
}

const getUsersById = (req, res) => {
    const id = req.params.id
    const user = users.find((el) => el._id === id)

    if (!user) {
        return res.status(404).json({
            status: "failed",
            message: `data with ${id} this not found`,
        })
    }

    res.status(200).json({
        status: "success",
        data: {
            user,
        },
    })
}

const editUsers = (req, res) => {
    const id = req.params.id
    const usersIndex = users.findIndex(
        (el) => el._id === id
    )

    if (usersIndex === -1) {
        return res.status(404).json({
            status: "failed",
            message: `data with ${id} this not found`,
        })
    }

    users[usersIndex] = {
        ...users[usersIndex],
        ...req.body,
    }

    fs.writeFile(
        `${__dirname}/dev-data/data/users.json`,
        JSON.stringify(users),
        (err) => {
            res.status(200).json({
                status: "success",
                message: `tour with this id ${id} edited`,
                data: {
                    user: users[usersIndex],
                },
            })
        }
    )
}

const deleteUsers = (req, res) => {
    const id = req.params.id

    const usersIndex = users.findIndex(
        (el) => el._id === id
    )

    if (usersIndex === -1) {
        return res.status(404).json({
            status: "failed",
            message: "data not found",
        })
    }

    users.splice(usersIndex, 1)

    fs.writeFile(
        `${__dirname}/dev-data/data/users.json`,
        JSON.stringify(users),
        (err) => {
            res.status(200).json({
                status: "success",
                message: "berhasil delete data",
                data: null,
            })
        }
    )
}

const createUsers = (req, res) => {
    const newId = users[users.length - 1].id + 1
    const newData = Object.assign(
        { id: newId },
        req.body
    )

    users.push(newData)
    fs.writeFile(
        `${__dirname}/dev-data/data/users.json`,
        JSON.stringify(users),
        (err) => {
            res.status(201).json({
                status: "success",
                data: {
                    tour: newData,
                },
            })
        }
    )
}

// app.get("/api/v1/tours", getAllTours)
// app.post("/api/v1/tours", createTour)
// app.get("/api/v1/tours/:id", getToursById)
// app.patch("/api/v1/tours/:id", editTour)
// app.delete("/api/v1/tours/:id", deleteTour)
const tourRouter = express.Router()
const userRouter = express.Router()

//Route Tours
tourRouter
    .route("/")
    .get(getAllTours)
    .post(createTour)

tourRouter
    .route("/:id")
    .get(getToursById)
    .patch(editTour)
    .delete(deleteTour)

//Route Users
userRouter
    .route("/")
    .get(getAllusers)
    .post(createUsers)

userRouter
    .route("/:id")
    .get(getUsersById)
    .patch(editUsers)
    .delete(deleteUsers)

app.use("/api/v1/tours", tourRouter)
app.use("/api/v1/users", userRouter)

app.listen(port, () => {
    console.log(`App running on port ${port}...`)
})
