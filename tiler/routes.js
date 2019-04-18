import Router from 'koa-router';
const router = new Router();
import SphericalMercator from '@mapbox/sphericalmercator';

const mercator = new SphericalMercator({size: 256});

router.get('/',
  async ctx => {
    ctx.body = {key: 'Hey! I make tiles!'};
  },
);

router.get('/query',
  async ctx=>{
    const {req,res,params,query,app} = ctx
    const {db} = app
    console.log('query is ',query)
    const {q}  = query
    console.log('trying ', q)
    const result = await db.any(q)
    ctx.body =  { result : result }
  }
)
router.get('/tiles/:z/:x/:y.mvt',
  async ctx=>{
    console.log('processing tile')
    const {params,query,app} = ctx
    const {db} = app
    const {q}  = query
    const {x,y,z} = params
    const layer_name = 'layer'
    console.log('coords ',x,y,z)
    const bbox = mercator.bbox(x,y,z,false)
    console.log('bbbox is ',bbox)

    const tile_query= `
        SELECT ST_AsMVT(q, '${layer_name}', 4096, 'mvt_geom')
    FROM (
      SELECT
          *,
          ST_AsMVTGeom(
              geom,
              ST_MakeEnvelope(${bbox[0]}, ${bbox[1]}, ${bbox[2]}, ${
    bbox[3]
  }, 4326),
              4096,
              256,
              true
          ) mvt_geom
      FROM (
        ${q}
      ) c
    ) q
   `;
    console.log('running query ', q)

    const result = await db.any(tile_query)
    ctx.body = result[0].st_asmvt
  }
)

export default router;
