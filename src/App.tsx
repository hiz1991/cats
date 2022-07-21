import React, {
  SyntheticEvent,
  useEffect,
  useState,
} from "react";
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { useDebouncedCallback } from "use-debounce";

import {
  CheckboxesWrapper,
  FlexWrapper,
  CatAttributesStyle,
  FormWrapper,
  LabelsWrapper,
  MainWrapper,
} from "./App.styled";
import { BreedEntity, CatEntity } from "./App.types";
import { Api } from "./services/Api";

const apiURL = "http://localhost:3001";

export const App = () => {
  const apiService = new Api();
  const [cats, setCats] = useState<CatEntity[]>([]);
  const [breeds, setBreeds] = useState<BreedEntity[] | null>(null);
  const [allCities, setAllCities] = useState<string[]>([]);
  const [searchText, setSearchText] = useState("");
  const [cityText, setCityText] = useState("All cities");

  const onSearchCompanies = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const searchParam = e.target.value;
    setSearchText(searchParam);
    updateCompaniesDebounced();
  };

  const updateCompanies = async (): Promise<CatEntity[]> => {
    const searchParam = searchText.toLowerCase();
    const data = await apiService.fetchCompanies(searchText.toLowerCase(), cityText, breeds);
    setCats(data);
    return data;
  };

  const updateCompaniesDebounced = useDebouncedCallback(updateCompanies, 200);

  const onBreedSelect = (key: string, value: string, checked: boolean) => {
    const Breed = {
      key: key,
      name: value,
      checked: checked,
    };
    if (!breeds) return;
    const index = breeds.findIndex(
      (c: BreedEntity) => c.name === Breed.name
    );
    if (index !== -1) {
      breeds[index] = Breed;
      setBreeds(breeds);
    }
    updateCompanies();
  };

  const onCitySelect = (event: SelectChangeEvent) => {
    setCityText(event.target.value);
    updateCompaniesDebounced();
  };

  useEffect(() => {
    updateCompanies().then((updatedCats) => {
      const fetchedbreeds = [...(breeds || [])];

      for (const cat of updatedCats) {
        const index = fetchedbreeds.findIndex(
          (Breed) => Breed.name === cat.breed
        );
        if (index === -1) {
          fetchedbreeds.push({
            key: cat.id,
            name: cat.breed,
            checked: true,
          });
        }
      }
      setBreeds(fetchedbreeds);

      const uniqueCities = new Set(updatedCats.map(cat => cat.city));
      setAllCities([...uniqueCities]);
    });
    return updateCompaniesDebounced.cancel;
  }, []);

  return (
    <MainWrapper>
      <FormWrapper>
        <FlexWrapper>
          <Select
            value={cityText}
            onChange={onCitySelect}
          >
            <MenuItem key={`${-1}`} value={'All cities'}>All cities</MenuItem>
            {allCities.map((city, ind) => (
              <MenuItem key={`${ind}`} value={city}>{city}</MenuItem>
            ))}
          </Select>
        </FlexWrapper>
        <FlexWrapper>
          <CheckboxesWrapper>
            {breeds?.map((breed) => (
              <FormControlLabel
                key={breed.key}
                control={
                  <Checkbox checked={breed.checked} value={breed.name} />
                }
                label={breed.name}
                onChange={(
                  _e: SyntheticEvent<Element, Event>,
                  checked: boolean
                ) => {
                  onBreedSelect(breed.key, breed.name, checked);
                }}
              />
            ))}
          </CheckboxesWrapper>
        </FlexWrapper>

        <FormGroup>
          <TextField
            value={searchText}
            type={"search"}
            placeholder={"Search cat... (2 letters min) "}
            onChange={onSearchCompanies}
          />

          <br />

          {cats.map((cat: CatEntity) => (
            <FlexWrapper key={cat.id}>
              <img src={"https://placekitten.com/100/150"} alt={"logo"} />
              <LabelsWrapper>
                <FormLabel key={`${cat.name}${cat.id}`}>
                  {cat.name}
                </FormLabel>
                <FormLabel key={`${cat.city}${cat.id}`}>
                  {cat.city}
                </FormLabel>
                <FormLabel
                  style={CatAttributesStyle}
                  key={`${cat.name}${cat.breed}`}
                >
                  {cat.breed}
                </FormLabel>
              </LabelsWrapper>
            </FlexWrapper>
          ))}
        </FormGroup>
      </FormWrapper>
    </MainWrapper>
  );
};
