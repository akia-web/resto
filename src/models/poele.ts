import { EnumPoele } from "../Enum/EnumPoele";

export interface Poele{
    step: EnumPoele | null,
    interval: number | undefined,
}