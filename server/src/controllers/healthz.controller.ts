import { ServerRoute } from "@hapi/hapi";

const healthz: ServerRoute = {
  method: 'GET',
  path: '/healthz',
  options: {
    auth: false,
  },
  handler: (_, h) => {
    return h.response().code(200)
  },
}

export default healthz;