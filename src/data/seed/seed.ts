import { AnnouncementModel, EventModel, MongoDatabase, PaysModel, RequestFormModel, UserModel } from '..';
import { envs } from '../../config';
import { seedData } from './data';


(async()=> {
  await MongoDatabase.connect({
    dbName: envs.MONGO_DB_NAME,
    mongoUrl: envs.MONGO_URL
  })

  await main();


  await MongoDatabase.disconnect();
})();


const randomBetween0AndX = ( x: number ) => {
  return Math.floor( Math.random() * x );
}



async function main() {

  // 0. Borrar todo!
  await Promise.all([
    UserModel.deleteMany(),
    AnnouncementModel.deleteMany(),
    EventModel.deleteMany(),
    PaysModel.deleteMany(),
    RequestFormModel.deleteMany()
  ])


  // 1. Crear usuarios
  const users = await UserModel.insertMany( seedData.users );

  const announcements = await AnnouncementModel.insertMany(
    seedData.announcements.map( announcement => {

      return {
        ...announcement,
        author: users[0]._id
      }

    })
  );


  console.info('SEEDED');
}