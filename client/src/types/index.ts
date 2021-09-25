export interface hasUser {
  id: string;
  user?: string;
}

export interface INote extends hasUser {
  title: string;
  body?: string;
  categories: ICategory[];
}

export interface ICategory extends hasUser {
  color: string;
  label: string;
}
