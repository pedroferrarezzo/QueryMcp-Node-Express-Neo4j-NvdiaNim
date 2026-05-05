import { ChatOpenAI } from "@langchain/openai";

/**
 * Cria um modelo de linguagem.
 * @param apiKey Chave de API 
 * @param modelName Nome do modelo
 * @param baseURL URL base para a API
 * @returns {ChatOpenAI} O modelo de linguagem configurado.
 */
export function createLangchainClient(
  apiKey: string,
  modelName: string,
  baseURL: string
): ChatOpenAI {
  return new ChatOpenAI({
    modelName: modelName,
    configuration: {
      baseURL: baseURL,
      apiKey: apiKey
    },
    temperature: 0,
  });
}