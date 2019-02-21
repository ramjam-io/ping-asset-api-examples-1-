import config from 'config'
import express from 'express'
import path from 'path'
import router from './routes'
let app = express();
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'pug');
app.use('/track', router.tracking)
app.get('/', (req, res, next) => {
    res.json({
        name: config.name,
        version: config.version
    });
});

app.use(function(err, req, res, next) {
    console.log(err)
    // set locals, only providing errors in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
    });
export default app;