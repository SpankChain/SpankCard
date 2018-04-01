declare module 'truffle-contract' {
  import * as Web3 from 'web3'

  namespace contract {
    export interface DeployedContract {
      address: string
    }

    export type HexString = string

    export interface TruffleContract<A> {
      'new' (...args: any[]): Promise<A & DeployedContract> // No Enforcement
      at (address: string): Promise<A & DeployedContract>
      deployed (): Promise<A & DeployedContract>

      defaults (params: Web3.CallData): void
      setProvider (provider: Web3.Provider): void
      setNetwork (networkId: string | number): void
      resetAddress (): void

      link <B>(instance: TruffleContract<B>): void
      link (name: string, address: string): void

      hasNetwork (networkId: string | number): boolean
      isDeployed (): boolean

      abi: Array<Web3.AbiDefinition>
      bytecode: HexString
    }

    export interface AnyTransactionEvent {
      event: string
      args: any
    }

    export interface TransactionEvent<A> {
      event: string
      args: A
    }

    export interface TransactionResult {
      tx: string
      logs: Array<AnyTransactionEvent>
      receipt: Web3.TransactionReceipt
    }
  }

  function contract <A>(json: any): contract.TruffleContract<A>
  export = contract
}
