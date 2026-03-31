const FOOD_LIBRARY = [
  {
    name: 'Banana',
    aliases: ['banana', 'banan', 'bananas'],
    caloriesPerUnit: 105,
    protein: 1.3,
    fats: 0.4,
    carbs: 27,
    servingLabel: 'medium banana',
  },
  {
    name: 'Apple',
    aliases: ['apple', 'apples'],
    caloriesPerUnit: 95,
    protein: 0.5,
    fats: 0.3,
    carbs: 25,
    servingLabel: 'medium apple',
  },
  {
    name: 'Egg',
    aliases: ['egg', 'eggs'],
    caloriesPerUnit: 78,
    protein: 6.3,
    fats: 5.3,
    carbs: 0.6,
    servingLabel: 'large egg',
  },
  {
    name: 'Chicken Breast',
    aliases: ['chicken breast', 'chicken', 'grilled chicken'],
    caloriesPerUnit: 165,
    protein: 31,
    fats: 3.6,
    carbs: 0,
    servingLabel: '100g serving',
  },
  {
    name: 'Rice',
    aliases: ['rice', 'white rice', 'cooked rice'],
    caloriesPerUnit: 130,
    protein: 2.7,
    fats: 0.3,
    carbs: 28,
    servingLabel: '100g serving',
  },
  {
    name: 'Oats',
    aliases: ['oats', 'oatmeal'],
    caloriesPerUnit: 389,
    protein: 16.9,
    fats: 6.9,
    carbs: 66.3,
    servingLabel: '100g serving',
  },
];

const normalizeFoodName = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const parseFoodQuery = (query) => {
  const trimmed = query.trim();
  const match = trimmed.match(
    /^(\d+(?:[.,]\d+)?)\s*(?:x|pcs?|pieces?|servings?)?\s+(.+)$/i
  );

  if (!match) {
    return { quantity: 1, foodName: trimmed };
  }

  return {
    quantity: parseFloat(match[1].replace(',', '.')),
    foodName: match[2].trim(),
  };
};

export const getFallbackFoodResult = (query) => {
  const { quantity, foodName } = parseFoodQuery(query);
  const normalized = normalizeFoodName(foodName);

  const item = FOOD_LIBRARY.find((entry) =>
    entry.aliases.some((alias) => {
      const normalizedAlias = normalizeFoodName(alias);
      return normalized === normalizedAlias || normalized.includes(normalizedAlias);
    })
  );

  if (!item) {
    return null;
  }

  const calories = Math.round(item.caloriesPerUnit * quantity);
  const proteins = (item.protein * quantity).toFixed(1);
  const fats = (item.fats * quantity).toFixed(1);
  const carbs = (item.carbs * quantity).toFixed(1);
  const quantityLabel = Number.isInteger(quantity) ? quantity : quantity.toFixed(1);
  const plural = quantity === 1 ? '' : 's';

  return {
    calories,
    message:
      `For ${quantityLabel} ${item.name}${plural} (${item.servingLabel}):\n` +
      `- Calories: ${calories} kcal\n` +
      `- Proteins: ${proteins}g\n` +
      `- Fats: ${fats}g\n` +
      `- Carbohydrates: ${carbs}g\n` +
      '- Source: local nutrition fallback',
  };
};
