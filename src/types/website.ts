import { Key, Modifier } from "./key";

export interface Website {
  id: string;
  title: string;
  url: string;
  modifiers: Modifier[];
  key: Key;
}
