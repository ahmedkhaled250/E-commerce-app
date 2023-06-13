import { roles } from "../../middleware/auth.js";

export const endPoint = {
    createCategory :[roles.Admin],
    updateCategory :[roles.Admin]
}