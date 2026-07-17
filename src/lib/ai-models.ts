import { gateway } from 'ai'

let CACHE = {
  cachedAt: 0,
  models: [] as {
    id: string
    name: string
  }[]
}

const CACHE_TTL = 5 * 60 * 1000 // 5 mins

export const getAIModels = async () => {
  if (Date.now() > CACHE.cachedAt + CACHE_TTL) {
    const { models } = await gateway.getAvailableModels()

    CACHE = {
      cachedAt: Date.now(),
      models: models
        .filter(
          model =>
            model.modelType === 'language' &&
            (model.id.startsWith('openai') ||
              model.id.startsWith('anthropic') ||
              model.id.startsWith('google'))
        )
        .map(model => ({
          id: model.id,
          name: model.name
        }))
    }
  }

  return CACHE.models
}
