import request, { Response } from 'supertest';
import { testServer } from '../../test-server';
import { MongoDatabase, UserModel } from '../../../src/data';
import { envs } from '../../../src/config';
import mongoose from 'mongoose';
import exp from 'constants';

jest.mock('nodemailer', () => ({
    createTransport: jest.fn().mockReturnValue({
      sendMail: jest.fn().mockResolvedValue('Mocked email sent'),
    }),
  }));

const testUser1 = {
    dni: "87654321B",
    name: "Jane",
    lastname: "Smith",
    password: "securePass456",
    birthDate: new Date("1985-08-20"),
    email: "jane.smith@example.com",
    emailValidated: false,
    admissionDate: new Date(),
};

const testUser2 = {
    dni: "12345678A",
    name: "John",
    lastname: "Doe",
    password: "password123",
    birthDate: new Date("1990-05-15"),
    email: "john.doe@example.com",
    emailValidated: true,
    admissionDate: new Date(),
    outDate: new Date("2024-02-15"),
    address: "123 Main Street",
    role: "ADMIN_ROLE",
};


describe('Prueba sobre la API de usuarios', () => {

    beforeAll(async () => {
        await testServer.start();
        await MongoDatabase.connect({
            mongoUrl: envs.MONGO_URL,
            dbName: envs.MONGO_DB_NAME,
        });
    });

    afterAll(async () => {
        await testServer.close();
        await MongoDatabase.disconnect();
    });

    beforeEach(async () => {
        await UserModel.deleteMany();
    });

    test('GET /api/user', async () => {
        // Arrange  
        await UserModel.create(testUser1);
        await UserModel.create(testUser2);


        // Act
        const { body } = await request(testServer.app)
            .get('/api/user')
            .expect(200);

        // Assert
        expect(body).toBeInstanceOf(Object);
        expect(body.users).toBeInstanceOf(Array);
        expect(body.users.length).toBe(2);

        expect(body.users[0]).toBeInstanceOf(Object);
        expect(body.users[0].dni).toBe(testUser1.dni);
        expect(body.users[0].outDate).toBeUndefined();

        expect(body.users[1]).toBeInstanceOf(Object);
        expect(body.users[1].dni).toBe(testUser2.dni);
    });

    test('GET /api/user/:id', async () => {
        // Arrange
        const user = await UserModel.create(testUser1);

        // Act
        const { body } = await request(testServer.app)
            .get(`/api/user/${user.id}`)
            .expect(200);

        // Assert
        expect(body).toEqual(expect.objectContaining({
            dni: testUser1.dni,
            name: testUser1.name,
            lastname: testUser1.lastname,
            email: testUser1.email,
            emailValidated: testUser1.emailValidated,
            admissionDate: testUser1.admissionDate.toISOString(),

        }));
    });

    test('GET-404 /api/user/:id', async () => {
        // Arrange
        const userId = new mongoose.Types.ObjectId();

        // Act
        const { body } = await request(testServer.app)
            .get(`/api/user/${userId}`)
            .expect(404);

        // Assert
        expect(body).toEqual({ error: `Usuario no encontrado` });

    });

    test('POST /api/user/login', async () => {
        // Arrange
        await request(testServer.app)
            .post('/api/user/register')
            .send(testUser1)
            .expect(201);

        await UserModel.findOneAndUpdate({ dni: testUser1.dni }, { emailValidated: true });

        const login = {
            dni: testUser1.dni,
            password: testUser1.password,
        }

        // Act
        const { body } = await request(testServer.app)
            .post('/api/user/login')
            .send(login)
            .expect(200);

        // Assert
        expect(body.user).toEqual(expect.objectContaining({
            dni: testUser1.dni,
            name: testUser1.name,
            lastname: testUser1.lastname,
            birthDate: testUser1.birthDate.toISOString().toString(),
            email: testUser1.email,
        }));

    });

    test('POST-404(usuario) /api/user/login', async () => {
        // Arrange
        const login = {
            dni: testUser1.dni,
            password: testUser1.password,
        }

        // Arrange
        const { body } = await request(testServer.app)
            .post('/api/user/login')
            .send(login)
            .expect(404);

        // Assert
        expect(body).toEqual({ error: `Usuario no encontrado` });

    });

    test('POST-400(contraseña) /api/user/login', async () => {
        // Arrange
        await request(testServer.app)
            .post('/api/user/register')
            .send(testUser1)
            .expect(201);

        await UserModel.findOneAndUpdate({ dni: testUser1.dni }, { emailValidated: true });

        const login = {
            dni: testUser1.dni,
            password: testUser2.password,
        }

        // Act
        const { body } = await request(testServer.app)
            .post('/api/user/login')
            .send(login)
            .expect(400);

        // Arrange
        expect(body).toEqual({ error: `Contraseña incorrecta` });
    });

    test('POST-400(novalidado) /api/user/login', async () => {
        // Arrange
        await request(testServer.app)
            .post('/api/user/register')
            .send(testUser1)
            .expect(201);

        const login = {
            dni: testUser1.dni,
            password: testUser1.password,
        }

        // Act
        const { body } = await request(testServer.app)
            .post('/api/user/login')
            .send(login)
            .expect(400);

        // Assert
        expect(body).toEqual({ error: `El correo no ha sido validado. Se ha enviado otro correo para validar` });
    });


    test('POST /api/user/register', async () => {

        // Act
        const { body } = await request(testServer.app)
            .post('/api/user/register')
            .send(testUser1)
            .expect(201);


        // Assert
        expect(body.user).toEqual(expect.objectContaining({
            dni: testUser1.dni,
            name: testUser1.name,
            lastname: testUser1.lastname,
            birthDate: testUser1.birthDate.toISOString().toString(),
            email: testUser1.email,
            emailValidated: testUser1.emailValidated,
        }));
    });

    test('POST-400 /api/user/register', async () => {
        // Arrange
        await UserModel.create(testUser1);

        // Act
        const { body } = await request(testServer.app)
            .post('/api/user/register')
            .send(testUser1)
            .expect(400);

        // Assert
        expect(body).toEqual({ error: `Email ya en uso` });
    });

    test('PUT /api/user/update/:id', async () => {
        // Arrange
        const user = await UserModel.create(testUser1);

        const update = {
            email: testUser2.email,
        }

        // Act
        const { body } = await request(testServer.app)
            .put(`/api/user/update/${user.id}`)
            .send(update)
            .expect(200);

        // Assert
        expect(body).toEqual(expect.objectContaining({
            dni: testUser1.dni,
            name: testUser1.name,
            lastname: testUser1.lastname,
            birthDate: testUser1.birthDate.toISOString().toString(),
            email: testUser2.email,
            emailValidated: testUser1.emailValidated,
        }));
    });

    test('PUT-404 /api/user/update/:id', async () => {
        // Arrange
        const userId = new mongoose.Types.ObjectId();

        const update = {
            email: testUser2.email,
        }

        // Act
        const { body } = await request(testServer.app)
            .put(`/api/user/update/${userId}`)
            .send(update)
            .expect(404);

        // Assert
        expect(body).toEqual({ error: `Usuario no encontrado` });

    });

    test('DELETE /api/user/delete/:id', async () => {
        // Arrange
        const user = await UserModel.create(testUser1);

        // Act
        await request(testServer.app)
            .delete(`/api/user/delete/${user.id}`)
            .expect(200);

        // Assert
    });

    test('DELETE-404 /api/user/delete/:id', async () => {
        // Arrange
        const userId = new mongoose.Types.ObjectId();

        // Act
        const { body } = await request(testServer.app)
            .delete(`/api/user/delete/${userId}`)
            .expect(404);

        // Assert
            expect(body).toEqual({ error: `Usuario no encontrado` });

    });

});
