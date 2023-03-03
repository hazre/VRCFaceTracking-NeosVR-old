export interface FaceExpression { [key: string]: number }

export interface Preset {
  id: string
  name: string
  parameters: Parameter[]
}

export interface Parameter {
  name: string
  input: Input
  output: Output
}

export interface Input {
  address: string
  type: string
}

export interface Output {
  address: string
  type: string
}
