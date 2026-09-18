// Reserved event names defined by Google Analytics 4
// Anything not in this set is considered a custom event

export const STANDARD_GA_EVENTS = new Set<string>([
    // Automatically collected (web + app)
    "first_visit",
    "first_open",
    "session_start",
    "user_engagement",
    "page_view",
    "screen_view",
    "app_remove",
    "app_update",
    "os_update",
    "app_exception",
    "error",
    "in_app_purchase",
    "dynamic_link_first_open",
    "dynamic_link_app_open",
    "notification_dismiss",
    "notification_foreground",
    "notification_receive",
    "notification_open",
    "notification_send",
    "ad_activeview",
    "ad_click",
    "ad_exposure",
    "ad_query",
    "ad_impression",
    "adunit_exposure",

    // Enhanced measurement (web)
    "click",
    "file_download",
    "form_start",
    "form_submit",
    "scroll",
    "video_start",
    "video_progress",
    "video_complete",
    "view_search_results",

    // Recommended events (ecommerce)
    "add_payment_info",
    "add_shipping_info",
    "add_to_cart",
    "add_to_wishlist",
    "begin_checkout",
    "purchase",
    "refund",
    "remove_from_cart",
    "select_item",
    "select_promotion",
    "view_cart",
    "view_item",
    "view_item_list",
    "view_promotion",

    // Recommended events (other)
    "login",
    "search",
    "select_content",
    "share",
    "sign_up",
    "generate_lead",
]);

export const isStandardGaEvent = (eventName: string): boolean =>
    STANDARD_GA_EVENTS.has(eventName.trim().toLowerCase());
