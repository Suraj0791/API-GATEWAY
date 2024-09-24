// seed.js
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');




const prisma = new PrismaClient();

async function main() {
  await prisma.role.createMany({
    data: [
      {
        name: 'ADMIN',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'CUSTOMER',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'FLIGHT_COMPANY',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  })
  console.log('Roles seeded successfully!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
