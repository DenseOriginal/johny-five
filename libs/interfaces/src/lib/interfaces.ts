export interface ILed {
    id: string,
    pin: number,
    on(): void,
    off(): void,
    toggle(): void,
    strobe(ms: number): void,
    blink(): void,
    blink(ms: number): void,
    brightness(val: number): void,
    fade(brightness: number, ms: number): void,
    fadeIn(ms: number): void,
    fadeOut(ms: number): void,
    pulse(ms: number): void,
    stop(ms: number): void,
}

export interface ILedChangeDTO {
    pin: number,
    fn: string,
    [index: string]: any
}

export interface IButtonPressDTO {
    pin: number
}