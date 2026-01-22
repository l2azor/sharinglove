const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
})

async function main() {
  console.log('Testing Supabase connection...')
  try {
    await prisma.$connect()
    console.log('✅ Successfully connected to Supabase!')

    // Try to query
    const result = await prisma.$queryRaw`SELECT 1 as test`
    console.log('✅ Query successful:', result)

  } catch (error) {
    console.error('❌ Connection failed:', error.message)
    console.error('Full error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
