import { EditorValue } from "react-rte";

export interface Node {
  id: string;
}
export interface IUser extends Node {
  id: string;
  googleId?: string;
  email?: string;
  name?: string;
  notes?: INote[];
  categories?: ICategory[];
}
export interface hasUser extends Node {
  user?: string;
}

export interface INote extends hasUser {
  title: string;
  body?: EditorValue;
  categories: ICategory[];
}

export interface ICategory extends hasUser {
  color: string;
  label: string;
}
