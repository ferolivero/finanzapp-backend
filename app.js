let express = require('express');
let cookieParser = require('cookie-parser');
let logger = require('morgan');

let categoriasRouter = require('./routes/categorias');
let configsRouter = require('./routes/configs');
let gastosRouter = require('./routes/gastos');
let indexRouter = require('./routes/index');
let informesRouter = require('./routes/informes');
let ingresosRouter = require('./routes/ingresos');
let tarjetasRouter = require('./routes/tarjetas');
let inventorsRouter = require('./routes/inventors');


let app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/config', configsRouter);
app.use('/gasto', gastosRouter);
app.use('/ingreso', ingresosRouter);
app.use('/categoria',(req, res, next) =>{
  const tipoCat= req.body.tipo;
  const cat1 ="categoriasIngresos"
  const cat2 ="categoriasGastos"
  if (( tipoCat=== cat1) || (tipoCat === cat2)){
    next()
  }
  else{
    res.status(404).send("categoria invalida")
   }
})
app.use('/categoria', categoriasRouter);
app.use('/informe', informesRouter);
app.use('/tarjeta', tarjetasRouter);
app.use('/api/inventors', inventorsRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
  });

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });

module.exports = app;
