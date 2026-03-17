import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schema'

export default defineConfig({
  name: 'default',
  title: 'intern-project',

  projectId: 'c0avhw9q',
  dataset: 'intern',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
