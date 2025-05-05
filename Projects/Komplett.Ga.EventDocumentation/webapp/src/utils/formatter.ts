/**
 * Safely formats a JSON string with proper indentation
 * @param json The JSON string to format
 * @returns Formatted JSON string or empty string if invalid
 */
export const makeJsonNice = (json: string): string => {
    if (!json) return "";
    
    try {
        const parsed = JSON.parse(json);
        return JSON.stringify(parsed, null, 2);
    } catch (error) {
        console.error("Error parsing JSON:", error);
        return json; // Return original string if parsing fails
    }
}
