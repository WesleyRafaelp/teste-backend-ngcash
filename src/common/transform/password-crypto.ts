import { hashSync } from 'bcrypt'

const cryptoTransform = {
  to(password: string): string {
    return hashSync(password, 10)
  },
  from(hash: string): string {
    return hash
  }
}

export default cryptoTransform