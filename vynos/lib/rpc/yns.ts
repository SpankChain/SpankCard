import {JSONRPC, RequestPayload, ResponsePayload} from '../Payload'

export interface RequestConstructor {
  method: string

  match(payload: RequestPayload): boolean

  new (): RequestPayload
}

function requestFactory<P> (method: string): RequestConstructor {
  method = `yns_${method}`

  return class GeneratedRequestPayload implements RequestPayload {
    id: number
    jsonrpc: typeof JSONRPC
    method: string
    params: P

    static method: string = method

    static match (payload: RequestPayload): payload is GeneratedRequestPayload {
      return payload.method === method
    }
  }
}

export const StatusRequest = requestFactory<any[]>('status')
export type StatusRequest = RequestPayload

export const RegisterHubRequest = requestFactory<[string, string]>('registerHub')
export type RegisterHubRequest = RequestPayload


export const AuthenticateRequest = requestFactory<[string, string]>('authenticate')
export type AuthenticateRequest = RequestPayload

export interface AuthenticateResponse extends ResponsePayload {
  success: boolean
  token?: string
}

export const InitAccountRequest = requestFactory<any[]>('initAccount')
export type InitAccountRequest = RequestPayload

export const GetSharedStateRequest = requestFactory<any[]>('getSharedState')
export type GetSharedStateRequest = RequestPayload

export const DidStoreMnemonicRequest = requestFactory<any[]>('didStoreMnemonic')
export type DidStoreMnemonicRequest = RequestPayload

export const RememberPageRequest = requestFactory<[string]>('rememberPage')
export type RememberPageRequest = RequestPayload

export const GenKeyringRequest = requestFactory<string[]>('genKeyring')
export type GenKeyringRequest = RequestPayload

export const RestoreWalletRequest = requestFactory<[string, string]>('restoreWallet')
export type RestoreWalletRequest = RequestPayload

export const UnlockWalletRequest = requestFactory<string[]>('unlockWallet')
export type UnlockWalletRequest = RequestPayload

export const LockWalletRequest = requestFactory<string[]>('lockWallet')
export type LockWalletRequest = RequestPayload

export const CloseChannelsForCurrentHubRequest = requestFactory<[string]>('closeChannelsForCurrentHub')
export type CloseChannelsForCurrentHubRequest = RequestPayload

export const DepositRequest = requestFactory<[string]>('deposit')
export type DepositRequest = RequestPayload

export const BuyRequest = requestFactory<[string, any]>('buyRequest')
export type BuyRequest = RequestPayload

export const TransactionResolved = requestFactory<never[]>('transactionResolved')
export type TransactionResolved = RequestPayload

export const ListChannelsRequest = requestFactory<any[]>('listChannels')
export type ListChannelsRequest = RequestPayload

export const PopulateChannelsRequest = requestFactory<any[]>('populateChannels')
export type PopulateChannelsRequest = RequestPayload

export const ToggleFrameRequest = requestFactory<[boolean]>('toggleFrame')
export type ToggleFrameRequest = RequestPayload

export const FetchHistoryRequest = requestFactory<any[]>('fetchHistory')
export type FetchHistoryRequest = RequestPayload

export const SendRequest = requestFactory<[string, string, string, string]>('send')
export type SendRequest = RequestPayload

export const ResetRequest = requestFactory<any[]>('reset')
export type ResetRequest = RequestPayload
