import { Key, Modifier } from "./key";

export interface Application {
  id: string;
  name: string;
  key: Key;
  modifiers: Modifier[];
}
