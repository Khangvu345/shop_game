import {BaseApi} from "./baseApi.ts";
import {type ICategory } from "../types";

export class CategoryApi extends BaseApi<ICategory> {
    constructor() {
        super('categories');
    }
}

export const categoryApi = new CategoryApi();