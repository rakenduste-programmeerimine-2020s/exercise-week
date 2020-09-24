const Joi = require('joi')
const Router = require('koa-router')
const Topic = require('./models/topic')

const router = new Router()

const createSchema = Joi.object({
  name: Joi.string().min(1)
})

const updateSchema = Joi.object({
  name: Joi.string().min(1)
})

router.get('/health', async (context) => {
  context.status = 200
})

router.get('/topics', async (context) => {
  const topics = await Topic.find({ deletedAt: null })

  context.status = 200
  context.body = topics
})

router.get('/topics/:id', async (context) => {
  const { id } = context.params

  const topic = await Topic.findOne({ _id: id, deletedAt: null })
  if (!topic) {
    context.status = 404
    context.body = { message: 'Not found' }

    return
  }

  context.status = 200
  context.body = topic
})

router.post('/topics', async (context) => {
  const { value, error } = createSchema.validate(context.request.body)
  if (error) {
    context.status = 400
    context.body = { error }

    return
  }

  const newTopic = new Topic(value)
  const topic = await newTopic.save()

  context.status = 201
  context.body = topic
})

router.put('/topics/:id', async (context) => {
  const { id } = context.params

  const { value, error } = updateSchema.validate(context.request.body)
  if (error) {
    context.status = 400
    context.body = { error }

    return
  }

  const topic = await Topic.findOne({ _id: id, deletedAt: null })
  if (!topic) {
    context.status = 404
    context.body = { message: 'Not found' }

    return
  }

  topic.name = value.name
  await topic.save()

  context.status = 200
  context.body = topic
})

router.delete('/topics/:id', async (context) => {
  const { id } = context.params

  const topic = await Topic.findOne({ _id: id, deletedAt: null })
  if (!topic) {
    context.status = 404
    context.body = { message: 'Not found' }

    return
  }

  topic.deletedAt = new Date()
  await topic.save()

  context.status = 200
  context.body = topic
})

// teine variant kuidas asja lahendada
router.delete('/topics/:id/2', async (context) => {
  const { n: rowsFound } = await Topic.updateOne(
    { _id: context.params.id, deletedAt: null },
    { deletedAt: new Date() }
  )

  if (!rowsFound) {
    context.status = 404
    return
  }

  context.status = 200
})

module.exports = router
