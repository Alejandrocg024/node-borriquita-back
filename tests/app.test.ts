import { envs } from '../src/config/envs';
import { Server } from '../src/presentation/server';
import { MongoDatabase } from '../src/data';

jest.mock( '../src/presentation/server' );

jest.mock('../src/data');


describe( 'should call server with arguments and start', () => {


  test( 'should work', async () => {

    await import( '../src/app' );

    expect( Server ).toHaveBeenCalledTimes( 1 );
    expect( Server ).toHaveBeenCalledWith( {
      port: envs.PORT,
      routes: expect.any( Function ),
    } );

    expect(MongoDatabase.connect).toHaveBeenCalledTimes(1);

    expect( Server.prototype.start ).toHaveBeenCalledWith();

  } );

} );