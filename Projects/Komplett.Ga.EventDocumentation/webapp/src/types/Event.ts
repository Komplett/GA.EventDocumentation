export interface Event {
    eventName: string; 
    description: string;
    format: string;
    type: string;
    tags: string;
    deprecated?: boolean;
}