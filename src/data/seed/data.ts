import { bcryptAdapter } from '../../config';



export const seedData = {

    users: [
        {
            dni: "12345678Z",
            name: "Alejandro",
            lastname: "Campano Galán",
            password: "$2a$10$WxiecmEh/Y1uYFlqTAX7ceY1ARW6IP5fJwnjJcvxssqZKFSUtF8Cq",
            birthDate: "2002-06-30T00:00:00.000Z",
            email: "alecamgal1@alum.us.es",
            emailValidated: true,
            admissionDate: "2024-09-15T23:43:41.116Z",
            role: "ADMIN_ROLE"
        },
        {
            dni: "22345678Z",
            name: "Alejandro",
            lastname: "Campano Galán",
            password: "$2a$10$WxiecmEh/Y1uYFlqTAX7ceY1ARW6IP5fJwnjJcvxssqZKFSUtF8Cq",
            birthDate: "2002-06-30T00:00:00.000Z",
            email: "alecamgal2@alum.us.es",
            emailValidated: true,
            admissionDate: "2024-09-15T23:43:41.116Z",
            role: "MAYORDOMIA_ROLE"
        },
        {
            dni: "32345678Z",
            name: "Alejandro",
            lastname: "Campano Galán",
            password: "$2a$10$WxiecmEh/Y1uYFlqTAX7ceY1ARW6IP5fJwnjJcvxssqZKFSUtF8Cq",
            birthDate: "2002-06-30T00:00:00.000Z",
            email: "alecamgal3@alum.us.es",
            emailValidated: true,
            admissionDate: "2024-09-15T23:43:41.116Z",
            role: "COMUNICACIONES_ROLE"
        },
        {
            dni: "42345678Z",
            name: "Alejandro",
            lastname: "Campano Galán",
            password: "$2a$10$WxiecmEh/Y1uYFlqTAX7ceY1ARW6IP5fJwnjJcvxssqZKFSUtF8Cq",
            birthDate: "2002-06-30T00:00:00.000Z",
            email: "alecamgal4@alum.us.es",
            emailValidated: true,
            admissionDate: "2024-09-15T23:43:41.116Z"
        },
    ],


    announcements: [
        {
            title: "Cartel Oliva 2024",
            publicationDate: "2023-09-01T10:00:00Z",
            modificationDate: "2023-09-02T10:00:00Z",
            available: true,
            body: "We are excited to announce the launch of our new product.",
            media: [
                "https://res.cloudinary.com/dwuuyxlyv/image/upload/v1726513708/borriquita/dea11ebd-a9dd-42ab-8ed7-0c8c1978c9c2.jpg"
            ]
        }
    ]


}
