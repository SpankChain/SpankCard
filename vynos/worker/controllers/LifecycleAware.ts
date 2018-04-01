export interface LifecycleAware {
  start(): Promise<void>
  stop(): Promise<void>
}
