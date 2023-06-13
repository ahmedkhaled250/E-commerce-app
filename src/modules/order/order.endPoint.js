import { roles } from "../../middleware/auth.js";


export const endPoint = {
    createOrder :[roles.Admin,roles.User,roles.Accouting],
}