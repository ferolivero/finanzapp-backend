let express = require('express')
const expressMongoDb = require('express-mongo-db')
const cors = require('cors')
const dotenv = require('dotenv').config()
let cookieParser = require('cookie-parser')
let logger = require('morgan')

let categoriasRouter = require('./routes/categorias')
let configsRouter = require('./routes/configs')
let gastosRouter = require('./routes/gastos')
let gastosRecurrentesRouter = require('./routes/gastosRecurrentes')
let ingresosRecurrentesRouter = require('./routes/ingresosRecurrentes')
let movimientosRecurrentesRouter = require('./routes/movimientosRecurrentes')
let indexRouter = require('./routes/index')
let informesRouter = require('./routes/informes')
let ingresosRouter = require('./routes/ingresos')
let movimientosRouter = require('./routes/movimientos')
let tarjetasRouter = require('./routes/tarjetas')
const uriMongodb = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_DOMAIN}/${process.env.MONGODB_DB_NAME}?retryWrites=true&w=majority`

let app = express()

app.use(expressMongoDb(uriMongodb))
app.use(cors())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.use('/api', indexRouter)
app.use('/config', configsRouter)
app.use('/movimiento/gasto', gastosRouter)
app.use('/movimiento/recurrente/gasto', gastosRecurrentesRouter)
app.use('/movimiento/recurrente/ingreso', ingresosRecurrentesRouter)
app.use('/movimiento/recurrente', movimientosRecurrentesRouter)
app.use('/movimiento/ingreso', ingresosRouter)
app.use('/categoria', categoriasRouter)
app.use('/informe', informesRouter)
app.use('/tarjeta', tarjetasRouter)
app.use('/movimiento', movimientosRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
