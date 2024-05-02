// confetti-js.d.ts
declare module 'confetti-js' {
  export default class ConfettiGenerator {
    constructor(config: any)
    render(): void
    clear(): void
  }
}
