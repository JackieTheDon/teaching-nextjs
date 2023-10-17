import { createDB } from '../../src/lib/db'
import fs from 'fs/promises'
import { faker } from '@faker-js/faker'

async function seedDB() {
  console.log('Seeding database...')

  const db = createDB()

  await db.deleteFrom('products').execute()
  await db.deleteFrom('products_reviews').execute()

  const data = []

  for (let i = 0; i < 10; i++) {
    data.push({
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: faker.number.int(2000),
    })
  }
  const productRev = await db.insertInto('products').values(data).returning('id').execute()

  for (const dataRev of productRev) {
    db.insertInto('products_reviews')
      .values([
        {
          product_id: dataRev.id,
          rating: faker.number.int(10),
          content: faker.lorem.paragraph(100),
        },
      ])
      .execute()
  }

  console.log('Done')
}

seedDB()
