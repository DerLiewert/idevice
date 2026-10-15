const translitMap = {
  а: "a",
  б: "b",
  в: "v",
  г: "g",
  д: "d",
  е: "e",
  ё: "yo",
  ж: "zh",
  з: "z",
  и: "i",
  й: "j",
  к: "k",
  л: "l",
  м: "m",
  н: "n",
  о: "o",
  п: "p",
  р: "r",
  с: "s",
  т: "t",
  у: "u",
  ф: "f",
  х: "h",
  ц: "c",
  ч: "ch",
  ш: "sh",
  щ: "shh",
  ъ: "",
  ы: "y",
  ь: "",
  э: "e",
  ю: "yu",
  я: "ya",
};

export function generateSlug(text: string) {
  return text
    .toLowerCase()
    .split("")
    .map((char) =>
      translitMap[char as keyof typeof translitMap] !== undefined
        ? translitMap[char as keyof typeof translitMap]
        : char,
    )
    .join("")
    .replace(/[^a-z0-9\s-_]/g, "") // Удаляем все спецсимволы кроме букв, цифр, пробелов, дефисов и подчеркиваний
    .trim()
    .replace(/[\s-_]+/g, "-") // Заменяем пробелы и знаки подчеркивания на один дефис
    .replace(/^-+|-+$/g, ""); // Удаляем дефисы в начале и конце строки
}
