import {ReactNode} from "react";

export interface EventStat {
    title: string;
    value: string | number;
    icon: ReactNode;
    color: string;
}