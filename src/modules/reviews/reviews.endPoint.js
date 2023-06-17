import { roles } from "../../middleware/auth.js";

export const endPoint = {
    addReview :[roles.Admin,roles.Accounting,roles.User],
    updateReview :[roles.Admin,roles.Accounting,roles.User]
}