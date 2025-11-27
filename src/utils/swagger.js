const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0', // Standar OpenAPI
    info: {
      title: 'API Toko Online Saya',
      version: '1.0.0',
      description: 'Dokumentasi API lengkap untuk E-Commerce App',
      contact: {
        name: 'Developer Kece',
        email: 'dev@email.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development Server'
      },
      // Nanti tambahkan URL Vercel di sini
      {
        url: 'https://belajar-express-iz88mx7rs-fitrahandres-projects.vercel.app', // Ganti dengan URL Vercel Anda
        description: 'Production Server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  // Lokasi file yang mau dibaca komentarnya (Routes kita)
  apis: ['./src/routes/*.js'], 
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;