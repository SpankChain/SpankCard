export default class Frame {
  element: HTMLIFrameElement
  containerElement: HTMLDivElement
  coverElement: HTMLDivElement
  style: HTMLStyleElement
  vynosScriptAddress: string
  notifications: HTMLDivElement

  constructor(scriptAddress: string, frameElement?: HTMLIFrameElement) {
    this.vynosScriptAddress = scriptAddress

    if (frameElement) {
      this.element = frameElement
    } else {
      this.containerElement = document.createElement('div')
      this.coverElement = document.createElement('div')
      this.element = document.createElement('iframe')
      this.element.id = 'ynos_frame'
      this.element.setAttribute('allowTransparency', 'true')

      this.coverElement.style.position = 'fixed'
      this.coverElement.style.width = '100vw'
      this.coverElement.style.height = '100vh'
      this.coverElement.style.backgroundColor = 'rgba(0, 0, 0, .7)'
      this.coverElement.style.top = '0'
      this.coverElement.style.left = '0'
      this.coverElement.style.zIndex = '100'
      this.coverElement.style.transition = 'opacity 500ms'

      let style = '#vynos_frame_img_close_button{width: 40px;bottom: 3px;position: absolute;left: 50%;margin-left: -20px;opacity:0;transition: opacity 1s}' +
        '#vynos_frame_close_button:hover > #vynos_frame_img_close_button{opacity: 1}'
      this.style = document.createElement('style')
      this.style.appendChild(document.createTextNode(style))

      this.notifications = document.createElement('div')
      this.notifications.id = 'vynos_notifications'
      this.notifications.style.marginTop = '0'
      this.notifications.style.height = '0'

      this.containerElement.appendChild(this.coverElement)
      this.containerElement.appendChild(this.element)
      this.containerElement.appendChild(this.style)
      this.containerElement.appendChild(this.notifications)

      this.setWalletCard()
      this.hide()
    }
    let frameSrc = this.vynosScriptAddress.replace(/vynos.js/, 'frame.html')
    this.element.src = window.location.href.match(/dev=true/) ? frameSrc + '?dev=true' : frameSrc
    this.element.setAttribute('sandbox', 'allow-scripts allow-modals allow-same-origin allow-popups allow-forms')
  }

  setWalletCard() {
    // Set iframe styles
    this.element.style.borderWidth = '0px'
    this.element.height = '100%'
    this.element.width = '100%'
    this.element.style.transition = 'opacity 1s'
    this.element.style.position = 'relative'
    this.element.style.zIndex = '200'
    // Set container styles
    this.containerElement.style.position = 'fixed'
    this.containerElement.style.top = '0px'
    this.containerElement.style.right = '0'
    this.containerElement.style.left = '0'
    this.containerElement.style.width = '100vw'
    this.containerElement.style.height = '100vh'
    this.containerElement.style.zIndex = '9999999'
    this.containerElement.style.transition = 'margin-top 0.7s'
  }

  attach(document: HTMLDocument) {
    if (this.containerElement && !this.containerElement.parentElement) {
      document.body.insertBefore(this.containerElement, document.body.firstChild)
    } else if (!this.element.parentElement) {
      document.body.insertBefore(this.containerElement, document.body.firstChild)
    }
  }

  setContainerStyle(containerStyle: CSSStyleDeclaration) {
    if (containerStyle.right) this.containerElement.style.right = containerStyle.right
    if (containerStyle.top) this.containerElement.style.top = containerStyle.top
    if (containerStyle.left) this.containerElement.style.left = containerStyle.left
    if (containerStyle.bottom) this.containerElement.style.bottom = containerStyle.bottom
  }

  display() {
    const ctx = this
    this.element.style.opacity = '1'
    this.containerElement.style.marginTop = '0px'
    ctx.coverElement.style.display = 'block'
    setTimeout(() => {
      ctx.coverElement.style.opacity = '1'
    }, 16)
  }

  hide() {
    const ctx = this
    this.containerElement.style.marginTop = '-100vh'
    this.element.style.opacity = '0'
    this.coverElement.style.opacity = '0'

    setTimeout(() => {
      ctx.coverElement.style.display = 'none'
    }, 250)
  }
}
