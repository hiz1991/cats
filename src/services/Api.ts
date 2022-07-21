import { BreedEntity, CatEntity } from "../App.types";

export class Api {
    constructor(private apiURL = "http://localhost:3001") {

    }

    async fetchCompanies(
        searchText: string,
        cityText: string,
        breeds: BreedEntity[] | null,
    ): Promise<CatEntity[]> {
        let url = `${this.apiURL}/cats`;

        // json server requires at lease two letters to search
        if (searchText.length > 1) {
            url += `?q=${searchText}`;
        }

        if (breeds && breeds.length !== 0) {
            const breedsParam = breeds
                .filter((breed) => breed.checked)
                .map((breed) => `breed=${breed.name}`)
                .join("&");

            if (!breedsParam) {
                return [];
            }

            url +=
                searchText.length > 1 ? `&${breedsParam}` : `?${breedsParam}`;
        }

        if (cityText !== 'All cities') {
            url +=
                breeds?.length || searchText.length > 1
                    ? `&city=${cityText}`
                    : `?city=${cityText}`;
        }

        const data = await fetch(url);
        return data.json();
    }
}