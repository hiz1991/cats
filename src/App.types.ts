export interface CatEntity {
  id: string;
  name: string;
  breed: string;
  city: string;
  createdAt: number;
  checked: boolean;
}

export interface BreedEntity {
  key: string;
  name: string;
  checked: boolean;
}
