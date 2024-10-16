import express, { Router } from 'express';
import fileUpload from 'express-fileupload';
import cors from 'cors';

interface Options {
  port: number;
  routes: Router;
  public_path?: string;
}


export class Server {

  public readonly app = express();
  private serverListener?: any;
  private readonly port: number;
  private readonly publicPath: string;
  private readonly routes: Router;

  constructor(options: Options) {
    const { port, routes, public_path = 'public' } = options;
    this.port = port;
    this.publicPath = public_path;
    this.routes = routes;
  }

  
  
  async start() {

    //CORS

    //* Middlewares
    this.app.use( express.json() ); // raw
    this.app.use( express.urlencoded({ extended: true }) ); // x-www-form-urlencoded
    this.app.use(fileUpload({
      limits: { fileSize: 50 * 1024 * 1024 },
    }));
    this.app.use( cors() );

    //* Routes
    this.app.use( this.routes );
    

    this.serverListener = this.app.listen(this.port, () => {
      console.info(`Server running on port ${ this.port }`);
    });

  }

  async close() {
    await this.serverListener?.close();
  }

}