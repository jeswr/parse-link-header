export default {
  input: ['index.js'],
  output: {
    dir: 'dist',
    preserveModules: true,
    sourcemap: true,
    format: 'cjs',
    entryFileNames: '[name].cjs'
  }
}
