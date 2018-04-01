export interface Listenable {
  addEventListener(name: string, cb: (e: any) => void): void

  removeEventListener(name: string, cb: (e: any) => void): void
}
