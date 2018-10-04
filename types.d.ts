export default interface SimpleScrollBar {
  initEl (element: Element): void;
  initAll (): void;
  moveBar (e: Event): void;
}
