import OpenAI from 'openai';

// Replace with your actual OpenAI API key
const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY || '';

export type Restaurant = {
  id: string;
  name: string;
  rating?: number;
  priceLevel?: number;
  vicinity?: string;
  types?: string[];
  photos?: { photo_reference: string; width: number; height: number }[];
};

export type FoodPreference = {
  cuisine?: string;
  dietaryRestrictions?: string[];
  spiceLevel?: string;
  budget?: string;
  mealType?: string;
  allergies?: string[];
  timeOfDay?: string;
  occasion?: string;
  preferredIngredients?: string[];
  dislikedIngredients?: string[];
};

export type RecommendationRequest = {
  restaurants: Restaurant[];
  preference: string;
  userHistory?: {
    previousOrders?: string[];
    favoriteRestaurants?: string[];
    dietaryPreferences?: string[];
  };
};

export type Recommendation = {
  restaurantId: string;
  restaurantName: string;
  dishName: string;
  description: string;
  reason: string;
  estimatedPrice?: string;
};

export class AIFoodService {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: OPENAI_API_KEY,
      dangerouslyAllowBrowser: true, // For client-side use
    });
  }

  async getRecommendation(request: RecommendationRequest): Promise<Recommendation[]> {
    const { restaurants, preference, userHistory } = request;

    // Prepare restaurant data for the AI
    const restaurantData = restaurants.map(r => ({
      id: r.id,
      name: r.name,
      rating: r.rating,
      priceLevel: r.priceLevel,
      vicinity: r.vicinity,
      types: r.types,
    }));

    // Format user history if available
    const historyContext = userHistory
      ? `User's previous orders: ${userHistory.previousOrders?.join(', ') || 'None'}.
         User's favorite restaurants: ${userHistory.favoriteRestaurants?.join(', ') || 'None'}.
         User's dietary preferences: ${userHistory.dietaryPreferences?.join(', ') || 'None'}.`
      : 'No previous order history available.';

    try {
      const response = await this.client.chat.completions.create({
        model: "gpt-4-turbo", // Use appropriate model
        messages: [
          {
            role: "system",
            content: `You are an AI food recommendation system. Your goal is to recommend dishes from the available restaurants based on user preferences.
                     Provide specific dish recommendations with descriptions and reasons why they match the user's preferences.`
          },
          {
            role: "user",
            content: `I'm looking for food recommendations. Here are the available restaurants: ${JSON.stringify(restaurantData)}.
                     My preference is: "${preference}".
                     ${historyContext}

                     Please recommend up to 3 specific dishes from these restaurants that match my preferences. For each recommendation, include:
                     1. Restaurant name
                     2. Restaurant ID
                     3. Dish name (be specific and realistic)
                     4. Brief description of the dish
                     5. Why you're recommending it based on my preferences
                     6. Estimated price range

                     Format your response as a JSON array with these fields: restaurantId, restaurantName, dishName, description, reason, estimatedPrice`
          }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No recommendation received from OpenAI');
      }

      const parsed = JSON.parse(content);
      return parsed.recommendations || [];
    } catch (error) {
      console.error('Error getting AI recommendation:', error);
      throw error;
    }
  }
}

export const aiFoodService = new AIFoodService();
