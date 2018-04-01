export interface DevWindow extends Window {
  RPC_URL: string
}

export interface VynosWindow extends Window {
  Vynos: typeof Vynos,
}

declare var window: DevWindow & VynosWindow;
