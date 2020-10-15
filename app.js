var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var categoriasRouter = require('./routes/categorias');
var configsRouter = require('./routes/configs');
var gastosRouter = require('./routes/gastos');
var indexRouter = require('./routes/index');
var informesRouter = require('./routes/informes');
var ingresosRouter = require('./routes/ingresos');
var tarjetasRouter = require('./routes/tarjetas');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/categoria', categoriasRouter);
app.use('/config', configsRouter);
app.use('/gasto', gastosRouter);
app.use('/', indexRouter);
app.use('/informe', informesRouter);
app.use('/ingreso', ingresosRouter);
app.use('/tarjeta', tarjetasRouter);

module.exports = app;
