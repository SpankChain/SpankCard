export default function postMessage(window: any, message: any) {
  const url = window.location !== window.parent.location
    ? document.referrer
    : document.location.href

  window.parent.postMessage(message, getDomain(url))
}

function getDomain(url: string) {
  const a = document.createElement('a')
  a.setAttribute('href', url)
  return (a as any).origin
}