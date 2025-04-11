import { API_TOKEN, API_URL } from "../../../constants/api.ts";
import { Event } from "../../../types/Event.ts";

/**
 * Fetches all events from the API
 * @returns Promise with array of Event objects
 * @throws Error with specific message if the request fails
 */
const getEvents = async (): Promise<Event[]> => {
    try {
        const response = await fetch(`${API_URL}getEvents`, {
            method: "GET",
            headers: {
                "x-functions-key": API_TOKEN,
            }
        });
        
        if (!response.ok) {
            const errorText = await response.text().catch(() => "Unknown error");
            throw new Error(`Failed to fetch events: ${response.status} ${response.statusText}. ${errorText}`);
        }
        
        return response.json();
    } catch (error) {
        console.error("Error fetching events:", error);
        throw error instanceof Error 
            ? error 
            : new Error("Failed to fetch events due to a network or server error");
    }
};

/**
 * Updates an event in the API
 * @param event The event object to update
 * @returns Promise resolving to true if successful
 * @throws Error with specific message if the request fails
 */
const updateEvent = async (event: Event): Promise<boolean> => {
    try {
        if (!event.eventName) {
            throw new Error("Event name is required");
        }
        
        const response = await fetch(`${API_URL}updateEvent`, {
            method: "POST",
            headers: {
                "x-functions-key": API_TOKEN,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(event),
        });
        
        if (!response.ok) {
            const errorText = await response.text().catch(() => "Unknown error");
            throw new Error(`Failed to update event: ${response.status} ${response.statusText}. ${errorText}`);
        }
        
        return true;
    } catch (error) {
        console.error("Error updating event:", error);
        throw error instanceof Error 
            ? error 
            : new Error("Failed to update event due to a network or server error");
    }
};

export { getEvents, updateEvent };