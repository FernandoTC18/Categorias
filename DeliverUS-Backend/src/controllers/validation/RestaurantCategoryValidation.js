import { check } from 'express-validator'
import { RestaurantCategory } from '../../models/models.js'

const checkCat = async (value) => {
  try {
    const c = await RestaurantCategory.findOne({ where: { name: value } })
    if (c) {
      return Promise.reject(new Error('There is another category with that name'))
    }
    return Promise.resolve()
  } catch (err) {
    return Promise.reject(err)
  }
}

const create = [
  check('name').exists().isString().isLength({ min: 1, max: 50 }).trim(),
  check('name').custom(async (value, { req }) => {
    return checkCat(value)
  }).withMessage('There is another category with that name')
]

export { create }
