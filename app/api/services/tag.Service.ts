import axios from "@/app/api/axios";


class TagService {
    //#region CREATE
    async create(name: string) {
        const props = {
            name: name
        }
        return await axios.post("/tags", props);
    };

    //#endregion

    //#region UPDATE
    async update(id: string, name: string) {
        const props = {
            id: id,
            name: name
        }
        return await axios.put("/tags", props);
    };

    //#endregion

    //#region GET BY ID
    async getById(id: string) {
        return await axios.get(`/tags/${id}`,);
    };

    //#endregion

    //#region DELETE
    async deleteById(id: string) {
        return await axios.delete(`/tags/${id}`,);
    };

    //#endregion

    //#region GET ALL
    async getAll() {
        return await axios.get(`/tags`,);
    };

    //#endregion

}

export const tagService = new TagService();