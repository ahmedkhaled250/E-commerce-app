import { roles } from "../../middleware/auth.js";

export const endPoint = {
    addReview :[roles.Admin,roles.Accouting,roles.User],
    updateReview :[roles.Admin,roles.Accouting,roles.User]
}