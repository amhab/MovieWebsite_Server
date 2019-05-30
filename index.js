import Hapi from 'hapi';
import Good from 'good';
const MySQL = require('mysql');
import AppRoutes from './app-routes';
import './consts/global'  ;


  const appServer = new Hapi.Server({  
    host:global.consts.SERVER_URL ,
    port:global.consts.SERVER_PORT ,
    routes: { cors: true }
  })

  
//   connection.connect();
  appServer.route(AppRoutes 
  );

  async function start() {
    try {
        await appServer.start();
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }
    console.log('appServer running at:', appServer.info.uri);
};

start();