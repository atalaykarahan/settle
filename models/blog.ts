import {CategoryModel} from "@/models/category";
import {TagModel} from "@/models/tag";

export interface BlogModel {
    blog_id?: string;
    blog_title?: string;
    blog_slug?: string;
    blog_description?: string;
    status_id?: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
    categories?: CategoryModel[];
    tags?: TagModel[];
}
