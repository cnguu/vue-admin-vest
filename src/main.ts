async function setup() {
  const { boot } = await import('./boot.ts')
  await boot()
}

setup()
