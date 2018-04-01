export type AllowedOrigins = string[] | '*'

export default class OriginValidator {
  private allowedOrigins: Set<string>

  private isWildcard: boolean = false

  constructor (allowedOrigins: AllowedOrigins) {
    if (allowedOrigins === '*') {
      this.isWildcard = true
    } else {
      this.allowedOrigins = new Set<string>(allowedOrigins)
    }
  }

  public isAllowed(origin: string) {
    if (this.isWildcard) {
      return true
    }

    return this.allowedOrigins.has(origin)
  }
}
