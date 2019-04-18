import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import routes from './routes';
import pg from 'pg-promise'

//import serve from 'koa-static'

const app = new Koa();
const pgp = pg()

app.db = pgp({
    host:'database',
    user:'docker',
    password:'docker',
    database:'docker'
})

app.use(cors({
    origin:'*'
}))
app.use(bodyParser());

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = {errors: [err]};
    ctx.app.emit('error', err, ctx);
  }
});

app.use(routes.routes());

export default app.listen(process.env.PORT || 3000);
