const seedData = async () => {}

if (import.meta.main) {
  try {
    await seedData()
  } catch (err) {
    console.error('Error seeding data:', err)
  } finally {
    process.exit(0)
  }
}
