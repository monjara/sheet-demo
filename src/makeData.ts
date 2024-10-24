import { faker } from '@faker-js/faker'

export type Person = {
  id: number
  firstName: string
  lastName: string
  age: number
  visits: number
  progress: number
  status: 'relationship' | 'complicated' | 'single'
  createdAt: Date
}

const range = (len: number) => {
  const arr: number[] = []
  for (let i = 0; i < len; i++) {
    arr.push(i)
  }
  return arr
}

const newPerson = (index: number): Person => {
  const d = new Date()
  return {
    id: index + 1,
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    age: faker.number.int(40),
    visits: faker.number.int(1000),
    progress: faker.number.int(100),
    createdAt: d,
    status: 'relationship',
  }
}

export function makeData(...lens: number[]) {
  const makeDataLevel = (depth = 0): Person[] => {
    const len = lens[depth] as number
    return range(len).map((d): Person => {
      return {
        ...newPerson(d),
      }
    })
  }

  return makeDataLevel()
}
