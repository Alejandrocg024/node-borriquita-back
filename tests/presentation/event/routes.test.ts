import request, { Response } from 'supertest';
import { testServer } from '../../test-server';
import { EventModel, MongoDatabase, UserModel } from '../../../src/data';
import { envs, JwtAdapter } from '../../../src/config';
import mongoose from 'mongoose';


let testUser1: any;
let token: any;

const testEvent1 = {
    title: "Evento 1",
    startDate: new Date("2024-04-01T09:00:00.000Z"),  
    endDate: new Date("2024-04-01T17:00:00.000Z"),  
    allDay: false,                               
    description: "Comentarios de prueba.",
    location: "Sevilla"
};

const testEvent2 = {
    title: "Evento 2",
    startDate: new Date("2024-06-15T00:00:00.000Z"),  
    endDate: new Date("2024-06-20T00:00:00.000Z"),  
    allDay: true,                              
    description: "Testeo."
};




describe('Prueba sobre la API de eventos', () => {

    beforeAll(async () => {
        await testServer.start();
        await MongoDatabase.connect({
            mongoUrl: envs.MONGO_URL,
            dbName: envs.MONGO_DB_NAME,
        });

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

        token = await JwtAdapter.generateToken({ id: testUser1.id }, '1h');
    });

    beforeEach(async () => {
        await EventModel.deleteMany();
    });

    afterAll(async () => {
        testServer.close();
        await MongoDatabase.disconnect();
    });

    test('GET /api/event', async () => {
        // Arrange  
        await EventModel.create(testEvent1);
        await EventModel.create(testEvent2);


        // Act
        const { body } = await request(testServer.app)
            .get('/api/event')
            .expect(200);

        // Assert
        expect(body).toBeInstanceOf(Object);
        expect(body.events).toBeInstanceOf(Array);
        expect(body.events.length).toBe(2);

        expect(body.events[0]).toBeInstanceOf(Object);
        expect(body.events[0].title).toBe(testEvent1.title);

        expect(body.events[1]).toBeInstanceOf(Object);
        expect(body.events[1].title).toBe(testEvent2.title);
        expect(body.events[1].location).toBeUndefined();
    });

    test('GET /api/event/:id', async () => {
        // Arrange
        const event = await EventModel.create(testEvent1);

        // Act
        const { body } = await request(testServer.app)
            .get(`/api/event/${event.id}`)
            .expect(200);

        // Assert
        expect(body).toEqual(expect.objectContaining({
            title: testEvent1.title,
            startDate: testEvent1.startDate.toISOString(),
            endDate: testEvent1.endDate.toISOString(),
            allDay: testEvent1.allDay,
            description: testEvent1.description,
            location: testEvent1.location
        }));
    });

    test('GET-404 /api/event/:id', async () => {
        // Arrange
        const eventId = new mongoose.Types.ObjectId();

        // Act
        const { body } = await request(testServer.app)
            .get(`/api/event/${eventId}`)
            .expect(404);

        // Assert
        expect(body).toEqual({ error: `Evento no encontrado` });
    });

    test('POST /api/event', async () => {
        // Arrange
        const event = await EventModel.create(testEvent1); 

        // Act
        const { body } = await request(testServer.app)
            .post(`/api/event`) 
            .set('Authorization', `Bearer ${token}`)
            .send(testEvent1)
            .expect(201);

        // Assert
        expect(body).toEqual(expect.objectContaining({
            title: testEvent1.title,
            startDate: testEvent1.startDate.toISOString(),
            endDate: testEvent1.endDate.toISOString(),
            allDay: testEvent1.allDay,
            description: testEvent1.description,
            location: testEvent1.location
        }));
    });

    test('PUT /api/event/:id', async () => {
        // Arrange
        const event = await EventModel.create(testEvent1); 

        const update = {
            title: "Evento 1 modificado",
            startDate: testEvent1.startDate,
            endDate: testEvent1.endDate,
            allDay: testEvent1.allDay,
            description: testEvent1.description,
            location: testEvent1.location
        };

        // Act
        const { body } = await request(testServer.app)
            .put(`/api/event/${event.id}`) 
            .set('Authorization', `Bearer ${token}`)
            .send(update)
            .expect(200); 

        // Assert
        expect(body).toEqual(expect.objectContaining({
            title: update.title,
            startDate: event.startDate.toISOString(),
            endDate: event.endDate.toISOString(),
            allDay: event.allDay,
            description: event.description,
            location: event.location
        }));
    });

    test('DELETE /api/event/:id', async () => {
        // Arrange
        const event = await EventModel.create(testEvent1); 

        // Act
        const { body } = await request(testServer.app)
            .delete(`/api/event/${event.id}`) 
            .set('Authorization', `Bearer ${token}`)
            .expect(200); 

        // Assert
    });

    test('DELETE-404 /api/event/:id', async () => {
        // Arrange
        const eventId = new mongoose.Types.ObjectId(); 

        // Act
        const { body } = await request(testServer.app)
            .delete(`/api/event/${eventId}`) 
            .set('Authorization', `Bearer ${token}`)

        // Assert
        expect(body).toEqual({ error: 'Evento no encontrado' });
    });


});
