
const Router = require('koa-router')
const Topic = require('./models/topic')

const router = new Router()

router.get('/health', async (context) => {
  context.status = 200
})

router.get('/topics', async (context) => {
  const topics = await Topic.find({})

  context.status = 200
  context.body = topics
})

router.get('/topics/:id', async (context) => {
  const { id } = context.params

  const topic = await Topic.findById(id)
  if (!topic) {
    context.status = 404
    context.body = { message: 'Not found' }

    return
  }

  context.status = 200
  context.body = topic
})

router.post('/topics', async (context) => {
  const { name } = context.request.body

  const newTopic = new Topic({ name })
  const topic = await newTopic.save()

  context.status = 201
  context.body = topic
})

router.put('/topics/:id', async (context) => {
  const { name } = context.request.body
  const { id } = context.params

  const topic = await Topic.findById(id)
  if (!topic) {
    context.status = 404
    context.body = { message: 'Not found' }

    return
  }

  topic.name = name
  await topic.save()

  context.status = 200
  context.body = topic
})

router.delete('/topics/:id', async () => {
  // TBA
})

module.exports = router
