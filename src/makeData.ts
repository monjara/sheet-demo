import { faker } from '@faker-js/faker'

export type Person = {
  id: number
  firstName: string
  lastName: string
  age: number
  visits: number
  progress: number
  status: 'relationship' | 'complicated' | 'single'
  param_1: number
  param_2: number
  param_3: number
  param_4: number
  param_5: number
  param_6: number
  param_7: number
  param_8: number
  param_9: number
  param_10: number
  param_11: number
  param_12: number
  param_13: number
  param_14: number
  param_15: number
  param_16: number
  param_17: number
  param_18: number
  param_19: number
  param_20: number
  param_21: number
  param_22: number
  param_23: number
  param_24: number
  param_25: number
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
    param_1: 0,
    param_2: 0,
    param_3: 0,
    param_4: 0,
    param_5: 0,
    param_6: 0,
    param_7: 0,
    param_8: 0,
    param_9: 0,
    param_10: 0,
    param_11: 0,
    param_12: 0,
    param_13: 0,
    param_14: 0,
    param_15: 0,
    param_16: 0,
    param_17: 0,
    param_18: 0,
    param_19: 0,
    param_20: 0,
    param_21: 0,
    param_22: 0,
    param_23: 0,
    param_24: 0,
    param_25: 0,
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
