import { useEffect, DependencyList, MouseEvent, KeyboardEvent } from "react"

// addEventListener<K extends keyof WindowEventMap>(type: K, listener: (this: Window, ev: WindowEventMap[K])

export const useWindowEvent = <K extends keyof WindowEventMap>(
  event: K,
  callback: (this: Window, ev: WindowEventMap[K]) => any,
  dependencies: DependencyList = [],
) => {
  useEffect(() => {
    window.addEventListener(event, callback)
    return () => window.removeEventListener(event, callback)
  }, [event, callback, ...dependencies])
}
