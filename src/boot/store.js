import store from '../stores'

export default async ({ app }) => {
  app.provide('store', store)
}
