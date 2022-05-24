import { useStorageLocal } from '~/composables/useStorageLocal'

export const storageDemo = useStorageLocal('apiUrl', 'https://tzdbapi.synapsetech.dev', { listenToStorageChanges: true })
