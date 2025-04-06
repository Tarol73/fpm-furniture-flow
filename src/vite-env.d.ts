
/// <reference types="vite/client" />

// Yandex Maps TypeScript declarations
interface YMaps {
  ready: (callback: () => void) => void;
  Map: new (container: string | HTMLElement, options: any) => any;
  Placemark: new (coordinates: [number, number], properties: any, options: any) => any;
}

interface Window {
  ymaps?: YMaps;
}
