const prisma = require('./prisma')

const { Puppies } = require('./models')

const { puppies } = require('./seedData')

const dropTables = async () => {
  console.log(`Dropping tables...`)
  await prisma.$executeRaw`DROP TABLE IF EXISTS puppies_tricks;`
  await prisma.$executeRaw`DROP TABLE IF EXISTS tricks;`
  await prisma.$executeRaw`DROP TABLE IF EXISTS puppies;`
  await prisma.$executeRaw`DROP TABLE IF EXISTS owners;`
}

const createTables = async () => {
  console.log(`Creating tables...`)
  await prisma.$executeRaw`
  CREATE TABLE owners (
    id SERIAL PRIMARY KEY,
    name VARCHAR (255) NOT NULL
  );`
  await prisma.$executeRaw`
  CREATE TABLE puppies (
    id SERIAL PRIMARY KEY,
    name VARCHAR (255) NOT NULL,
    email VARCHAR (255) UNIQUE NOT NULL,
    "isCute" BOOLEAN DEFAULT true,
    age INTEGER,
    "ownerId" INTEGER REFERENCES owners(id)
  );`
  await prisma.$executeRaw`
  CREATE TABLE tricks (
    id SERIAL PRIMARY KEY,
    title VARCHAR
  );`
  await prisma.$executeRaw`
  CREATE TABLE puppies_tricks (
    id SERIAL PRIMARY KEY,
    puppy_id INTEGER REFERENCES puppies(id),
    trick_id INTEGER REFERENCES tricks(id),
    UNIQUE(puppy_id, trick_id)
  );
`
}

const seedDb = async () => {
  console.log('creating pups...')
  const pups = await Promise.all(puppies.map(Puppies.createPuppy))
  console.log('Pups:', pups)
}

const initDb = async () => {
  try {
    await dropTables()
    await createTables()
    await seedDb()
  } catch (error) {
    console.error(error)
  } finally {
    await prisma.$disconnect()
  }
}

initDb()
