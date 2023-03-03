import { fromBuffer } from 'osc-min'

export const sanitizeMessage = (decoded) => {
  const message = []
  message.push(decoded.address)
  decoded.args.forEach((arg) => {
    message.push(arg.value)
  })
  return message
}

export const sanitizeBundle = (decoded) => {
  decoded.elements = decoded.elements.map((element) => {
    if (element.oscType === 'bundle')
      return sanitizeBundle(element)
    else if (element.oscType === 'message')
      return sanitizeMessage(element)
  })
  return decoded
}

export const decode = (data: Uint8Array) => {
  const decoded = fromBuffer(data)
  if (decoded.oscType === 'bundle')
    return sanitizeBundle(decoded)

  else if (decoded.oscType === 'message')
    return sanitizeMessage(decoded)
}
