import { en } from "./locales/en";
import { ja } from "./locales/ja";

type MessageKey = keyof typeof en;

const isJapanese = navigator.language.startsWith("ja");
const messages = isJapanese ? ja : en;

export const t = (key: MessageKey): string => {
  return messages[key] || key;
};
