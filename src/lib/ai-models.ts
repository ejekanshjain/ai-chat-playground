import { gateway } from 'ai'

export const getAIModels = async () => {
  const { models } = await gateway.getAvailableModels()

  return models
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
