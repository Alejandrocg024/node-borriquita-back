import request, { Response } from 'supertest';
import { testServer } from '../../test-server';
import { AnnouncementModel, EventModel, MongoDatabase, PaysModel, UserModel } from '../../../src/data';
import { envs, JwtAdapter } from '../../../src/config';
import mongoose from 'mongoose';

interface Announcement {
    title:            string;
    publicationDate:  Date;
    modificationDate: Date;
    available:        boolean;
    author:           string;
    body:             string;
    media?:            string;
  }

let testUser1: any;
let token: any;
let testAnnouncement1: Announcement;
let testAnnouncement2: Announcement;


describe('Prueba sobre la API de noticias', () => {

    beforeAll(async () => {
        await testServer.start();
        await MongoDatabase.connect({
            mongoUrl: envs.MONGO_URL,
            dbName: envs.MONGO_DB_NAME,
        });
        await mongoose.connection.db?.dropDatabase();

        testUser1 = await UserModel.create({
            dni: "87654321B",
            name: "Jane",
            lastname: "Smith",
            password: "securePass456",
            birthDate: new Date("1985-08-20"),
            email: "jane.smith@example.com",
            emailValidated: false,
            admissionDate: new Date(),
            role: "ADMIN_ROLE"
        });

        testAnnouncement1 = {
            title: "Noticia 1",
            publicationDate: new Date("2023-10-01T00:00:00.000Z"),
            modificationDate: new Date("2023-10-05T00:00:00.000Z"),
            available: true,
            author: testUser1.id,
            body: "Ejemplo de noticia 1",
            media: "https://example.com/async-article-image.jpg"
        };

        testAnnouncement2 = {
            title: "Noticia 2",
            publicationDate: new Date("2024-01-15T00:00:00.000Z"),
            modificationDate: new Date("2024-01-20T00:00:00.000Z"),
            available: false,
            author: testUser1.id,
            body: "Ejemplo de noticia 2",
        };

        token = await JwtAdapter.generateToken({ id: testUser1.id }, '1h');
    });

    beforeEach(async () => {
        await AnnouncementModel.deleteMany();
    });

    afterAll(async () => {
        await AnnouncementModel.deleteMany();
        await UserModel.deleteMany();

        testServer.close();
        await MongoDatabase.disconnect();
    });

    test('GET /api/announcement', async () => {
        // Arrange  
        await AnnouncementModel.create(testAnnouncement1);
        await AnnouncementModel.create(testAnnouncement2);


        // Act
        const { body } = await request(testServer.app)
            .get('/api/announcement')
            .expect(200);

        // Assert
        expect(body).toBeInstanceOf(Object);
        expect(body.announcements).toBeInstanceOf(Array);
        expect(body.announcements.length).toBe(2);

        expect(body.announcements[0]).toBeInstanceOf(Object);
        expect(body.announcements[0].title).toBe(testAnnouncement1.title);

        expect(body.announcements[1]).toBeInstanceOf(Object);
        expect(body.announcements[1].title).toBe(testAnnouncement2.title);
        expect(body.announcements[1].media).toBeUndefined();
    });

    test('GET /api/announcement/:id', async () => {
        // Arrange
        const ann = await AnnouncementModel.create(testAnnouncement1);

        // Act
        const { body } = await request(testServer.app)
            .get(`/api/announcement/${ann.id}`)
            .expect(200);

        // Assert
        expect(body).toEqual(expect.objectContaining({
            title: testAnnouncement1.title,
            publicationDate: testAnnouncement1.publicationDate.toISOString(),
            modificationDate: testAnnouncement1.modificationDate.toISOString(),
            available: testAnnouncement1.available,
            body: testAnnouncement1.body,
            media: testAnnouncement1.media
        }));
    });

    test('GET-404 /api/announcement/:id', async () => {
        // Arrange
        const annId = new mongoose.Types.ObjectId();

        // Act
        const { body } = await request(testServer.app)
            .get(`/api/announcement/${annId}`)
            .expect(404);

        // Assert
        expect(body).toEqual({ error: `Noticia no encontrada` });
    });

    test('POST /api/announcement', async () => {
        // Arrange
        const user = await UserModel.create(testUser1); 

        // Act
        const { body } = await request(testServer.app)
            .post(`/api/announcement`) 
            .set('Authorization', `Bearer ${token}`)
            .send(testAnnouncement1)
            .expect(201);

        // Assert
        expect(body).toEqual(expect.objectContaining({
            title: testAnnouncement1.title,
            available: testAnnouncement1.available,
            body: testAnnouncement1.body,
            media: testAnnouncement1.media
        }));
    });

    test('PUT /api/announcement/:id', async () => {
        // Arrange
        const ann = await AnnouncementModel.create(testAnnouncement1); 

        const update = {
            id: ann.id,
            title: "Noticia 1 modificado",
            modificationDate: new Date(),
            available: testAnnouncement1.available,
            body: testAnnouncement1.body,

        };

        // Act
        const { body } = await request(testServer.app)
            .put(`/api/announcement/${ann.id}`) 
            .set('Authorization', `Bearer ${token}`)
            .send(update)
            .expect(200); 

        // Assert
        expect(body).toEqual(expect.objectContaining({
            title: update.title,
            publicationDate: testAnnouncement1.publicationDate.toISOString(),
            available: testAnnouncement1.available,
            body: testAnnouncement1.body,
            media: testAnnouncement1.media
        }));
    });

    test('PUT-500 /api/announcement/:id', async () => {
        // Arrange
        const annId = new mongoose.Types.ObjectId();

        const update = {
            title: "Noticia 1 modificado",
            modificationDate: new Date(),
            available: testAnnouncement1.available,
            body: testAnnouncement1.body,
        };

        // Act
        const { body } = await request(testServer.app)
            .put(`/api/announcement/${annId}`) 
            .set('Authorization', `Bearer ${token}`)
            .send(update)
            .expect(404); 

        // Assert
        expect(body).toEqual({ error: 'Noticia no encontrada' });
    });

    test('DELETE /api/announcement/:id', async () => {
        // Arrange
        const ann = await AnnouncementModel.create(testAnnouncement1); 

        // Act
        const { body } = await request(testServer.app)
            .delete(`/api/announcement/${ann.id}`) 
            .set('Authorization', `Bearer ${token}`)
            .expect(200); 

        // Assert
    });

    test('DELETE-404 /api/announcement/:id', async () => {
        // Arrange
        const annId = new mongoose.Types.ObjectId(); 

        // Act
        const { body } = await request(testServer.app)
            .delete(`/api/announcement/${annId}`) 
            .set('Authorization', `Bearer ${token}`)
            .expect(404); 

        // Assert
        expect(body).toEqual({ error: 'Noticia no encontrada' });
    });

});