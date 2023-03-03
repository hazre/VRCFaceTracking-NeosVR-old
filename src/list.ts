import fs from 'fs'
import type { FaceExpression, Preset } from './d.js'

fs.readFile('./static/parameters.txt', 'utf8', (err, data) => {
  if (err)
    throw err

  const lines = data.split('\n').map(line => line.replace('\r', ''))
  const static_obj: FaceExpression = {}
  const preset_obj: Preset = {
    id: 'sample',
    name: 'expressions',
    parameters: [],
  }

  lines.forEach((line) => {
    const obj = {
      name: `${line}`,
      input: {
        address: `/avatar/parameters/${line}`,
        type: 'Float',
      },
      output: {
        address: `/avatar/parameters/${line}`,
        type: 'Float',
      },
    }
    static_obj[line] = 0
    preset_obj.parameters.push(obj)
  })
  fs.writeFile('./static/expressions.json', JSON.stringify(static_obj, null, 2), (err) => {
    if (err)
      throw err
    console.log('Data written to file')
  })
  fs.writeFile('./static/vrc_parameters.json', JSON.stringify(preset_obj, null, 2), (err) => {
    if (err)
      throw err
    console.log('Data written to file')
  })
})
