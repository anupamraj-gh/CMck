import type { Product } from '@/types'

export const products: Product[] = [
  {
    id: 'artisan-cake',
    name: 'Artisan Celebration Cake',
    shortDescription: 'Layers of velvety sponge with handcrafted frosting',
    description:
      'Our signature celebration cake is baked fresh daily using premium Belgian chocolate, farm-fresh eggs, and organic flour. Each layer is hand-frosted with our secret recipe buttercream.',
    basePrice: 899,
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80',
    heroImage: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=1200&q=80',
    videoUrl:
      'https://videos.pexels.com/video-files/20685100/20685100-uhd_2560_1440_25fps.mp4',
    videoPoster: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1200&q=80',
    highlights: ['Fresh Ingredients', 'Handmade', 'No Preservatives', 'Customizable'],
    prepTime: '45 mins',
    rating: 4.9,
    reviewCount: 128,
    ingredients: [
      'Organic all-purpose flour',
      'Farm-fresh eggs',
      'Belgian dark chocolate',
      'Pure vanilla extract',
      'Fresh cream butter',
      'Organic cane sugar',
      'Fresh seasonal fruits',
    ],
    preparationSteps: [
      {
        step: 1,
        title: 'Prepare the Batter',
        description:
          'Cream butter and sugar until light and fluffy. Add eggs one at a time, then fold in sifted flour and cocoa.',
      },
      {
        step: 2,
        title: 'Bake the Layers',
        description:
          'Divide batter into pans and bake at 175°C for 25-30 minutes until a toothpick comes out clean.',
      },
      {
        step: 3,
        title: 'Make the Frosting',
        description:
          'Whip fresh cream with vanilla and melted chocolate to create our signature silky frosting.',
      },
      {
        step: 4,
        title: 'Assemble & Decorate',
        description:
          'Layer cakes with frosting, add fresh fruits, and finish with elegant piping and gold dust.',
      },
    ],
    cookingInstructions: [
      'Allow cake to reach room temperature before serving for best flavor.',
      'Store refrigerated for up to 3 days in an airtight container.',
      'Best consumed within 24 hours of delivery.',
    ],
    servingSuggestions:
      'Pair with a scoop of vanilla ice cream or fresh berries. Perfect for celebrations of 8-10 guests.',
    customizations: [
      {
        id: 'base-flavor',
        label: 'Base Flavor',
        type: 'radio',
        required: true,
        options: [
          { id: 'chocolate', label: 'Rich Chocolate', priceModifier: 0 },
          { id: 'vanilla', label: 'Madagascar Vanilla', priceModifier: 0 },
          { id: 'red-velvet', label: 'Red Velvet', priceModifier: 100 },
          { id: 'carrot', label: 'Spiced Carrot', priceModifier: 80 },
        ],
      },
      {
        id: 'frosting',
        label: 'Frosting',
        type: 'radio',
        required: true,
        options: [
          { id: 'buttercream', label: 'Classic Buttercream', priceModifier: 0 },
          { id: 'cream-cheese', label: 'Cream Cheese', priceModifier: 50 },
          { id: 'ganache', label: 'Dark Chocolate Ganache', priceModifier: 120 },
        ],
      },
      {
        id: 'toppings',
        label: 'Toppings',
        type: 'checkbox',
        options: [
          { id: 'berries', label: 'Fresh Berries', priceModifier: 80 },
          { id: 'nuts', label: 'Roasted Almonds', priceModifier: 60 },
          { id: 'gold-dust', label: 'Edible Gold Dust', priceModifier: 150 },
        ],
      },
      {
        id: 'size',
        label: 'Size',
        type: 'radio',
        required: true,
        options: [
          { id: 'small', label: '6 inch (6-8 servings)', priceModifier: 0 },
          { id: 'medium', label: '8 inch (10-12 servings)', priceModifier: 300 },
          { id: 'large', label: '10 inch (14-16 servings)', priceModifier: 600 },
        ],
      },
      {
        id: 'sweetness',
        label: 'Sweetness Level',
        type: 'select',
        required: true,
        options: [
          { id: 'regular', label: 'Regular', priceModifier: 0 },
          { id: 'less-sweet', label: 'Less Sweet', priceModifier: 0 },
          { id: 'extra-sweet', label: 'Extra Sweet', priceModifier: 0 },
        ],
      },
    ],
  },
  {
    id: 'protein-bar',
    name: 'Protein Power Bar',
    shortDescription: 'High-protein energy bars with natural ingredients',
    description:
      'Fuel your day with our handcrafted protein bars packed with 22g of plant-based protein, organic oats, and superfood seeds. No artificial sweeteners, just pure nutrition.',
    basePrice: 149,
    image: '',
    heroImage: '',
    videoUrl:
      'https://videos.pexels.com/video-files/6754072/6754072-uhd_2560_1440_25fps.mp4',
    videoPoster: '',
    highlights: ['High Protein', 'No Preservatives', 'Handmade', 'Fresh Ingredients'],
    prepTime: '20 mins',
    rating: 4.8,
    reviewCount: 256,
    ingredients: [
      'Organic rolled oats',
      'Pea protein isolate',
      'Almond butter',
      'Organic honey',
      'Dark chocolate chips',
      'Chia seeds',
      'Dried cranberries',
    ],
    preparationSteps: [
      {
        step: 1,
        title: 'Mix Dry Ingredients',
        description: 'Combine oats, protein powder, and seeds in a large mixing bowl.',
      },
      {
        step: 2,
        title: 'Bind with Wet Ingredients',
        description: 'Warm almond butter and honey, then mix until evenly combined.',
      },
      {
        step: 3,
        title: 'Press & Set',
        description: 'Press mixture into a lined tray and refrigerate for 2 hours.',
      },
      {
        step: 4,
        title: 'Cut & Package',
        description: 'Cut into bars, drizzle with dark chocolate, and wrap individually.',
      },
    ],
    cookingInstructions: [
      'Store in a cool, dry place or refrigerate for extended freshness.',
      'Best consumed within 7 days of delivery.',
      'Perfect pre or post-workout snack.',
    ],
    servingSuggestions: 'Enjoy with a glass of almond milk or as a mid-day energy boost.',
    customizations: [
      {
        id: 'protein-type',
        label: 'Protein Type',
        type: 'radio',
        required: true,
        options: [
          { id: 'pea', label: 'Pea Protein', priceModifier: 0 },
          { id: 'whey', label: 'Whey Protein', priceModifier: 30 },
          { id: 'blend', label: 'Plant Blend', priceModifier: 20 },
        ],
      },
      {
        id: 'flavor',
        label: 'Base Flavor',
        type: 'radio',
        required: true,
        options: [
          { id: 'chocolate', label: 'Dark Chocolate', priceModifier: 0 },
          { id: 'peanut', label: 'Peanut Butter', priceModifier: 0 },
          { id: 'coconut', label: 'Coconut Almond', priceModifier: 20 },
        ],
      },
      {
        id: 'add-ins',
        label: 'Add-ins',
        type: 'checkbox',
        options: [
          { id: 'extra-protein', label: 'Extra Protein (+5g)', priceModifier: 40 },
          { id: 'super-seeds', label: 'Super Seed Mix', priceModifier: 25 },
          { id: 'cacao-nibs', label: 'Cacao Nibs', priceModifier: 30 },
        ],
      },
      {
        id: 'size',
        label: 'Size',
        type: 'radio',
        required: true,
        options: [
          { id: 'regular', label: 'Regular (60g)', priceModifier: 0 },
          { id: 'large', label: 'Large (90g)', priceModifier: 50 },
        ],
      },
    ],
  },
  {
    id: 'gourmet-burger',
    name: 'Gourmet Craft Burger',
    shortDescription: 'Premium patty with artisan bun and house sauces',
    description:
      'Our gourmet burger features a hand-formed grass-fed beef patty, brioche bun baked in-house, and our signature trio of house-made sauces. A restaurant-quality experience delivered to your door.',
    basePrice: 349,
    image: '',
    heroImage: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=1200&q=80',
    videoUrl:
      'https://videos.pexels.com/video-files/7047116/7047116-uhd_2560_1440_25fps.mp4',
    videoPoster: '',
    highlights: ['Fresh Ingredients', 'Handmade', 'High Protein', 'No Preservatives'],
    prepTime: '25 mins',
    rating: 4.7,
    reviewCount: 342,
    ingredients: [
      'Grass-fed beef patty (180g)',
      'House-baked brioche bun',
      'Aged cheddar cheese',
      'Fresh lettuce & tomato',
      'Caramelized onions',
      'House special sauce',
      'Pickled jalapeños',
    ],
    preparationSteps: [
      {
        step: 1,
        title: 'Form the Patty',
        description: 'Hand-form premium beef into a thick patty, seasoned with our spice blend.',
      },
      {
        step: 2,
        title: 'Grill to Perfection',
        description: 'Sear on high heat for a caramelized crust, cooked to your preference.',
      },
      {
        step: 3,
        title: 'Toast the Bun',
        description: 'Butter and toast brioche buns until golden and crisp.',
      },
      {
        step: 4,
        title: 'Build & Serve',
        description: 'Layer fresh ingredients, add melted cheese, and finish with house sauces.',
      },
    ],
    cookingInstructions: [
      'Consume immediately upon delivery for the best experience.',
      'Reheat patty in a pan over medium heat if needed — avoid microwave.',
      'Best enjoyed within 30 minutes of delivery.',
    ],
    servingSuggestions: 'Comes with seasoned fries. Add a craft soda for the full experience.',
    customizations: [
      {
        id: 'patty',
        label: 'Patty Type',
        type: 'radio',
        required: true,
        options: [
          { id: 'beef', label: 'Grass-Fed Beef', priceModifier: 0 },
          { id: 'chicken', label: 'Grilled Chicken', priceModifier: -30 },
          { id: 'plant', label: 'Plant-Based', priceModifier: 20 },
        ],
      },
      {
        id: 'cheese',
        label: 'Cheese',
        type: 'radio',
        required: true,
        options: [
          { id: 'cheddar', label: 'Aged Cheddar', priceModifier: 0 },
          { id: 'swiss', label: 'Swiss', priceModifier: 20 },
          { id: 'blue', label: 'Blue Cheese', priceModifier: 40 },
          { id: 'none', label: 'No Cheese', priceModifier: -20 },
        ],
      },
      {
        id: 'sauces',
        label: 'Sauces',
        type: 'checkbox',
        options: [
          { id: 'special', label: 'House Special', priceModifier: 0 },
          { id: 'truffle', label: 'Truffle Mayo', priceModifier: 50 },
          { id: 'chipotle', label: 'Chipotle Aioli', priceModifier: 30 },
        ],
      },
      {
        id: 'extras',
        label: 'Extras',
        type: 'checkbox',
        options: [
          { id: 'bacon', label: 'Crispy Bacon', priceModifier: 60 },
          { id: 'avocado', label: 'Fresh Avocado', priceModifier: 40 },
          { id: 'egg', label: 'Fried Egg', priceModifier: 30 },
        ],
      },
    ],
  },
  {
    id: 'cookie-collection',
    name: 'Artisan Cookie Collection',
    shortDescription: 'Six handcrafted cookies with premium ingredients',
    description:
      'A curated box of six artisan cookies, each baked to golden perfection with real butter, premium chocolate, and natural flavors. From classic chocolate chip to exotic matcha white chocolate.',
    basePrice: 299,
    image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800&q=80',
    heroImage: '',
    videoUrl:
      'https://videos.pexels.com/video-files/4984665/4984665-uhd_2560_1440_25fps.mp4',
    videoPoster: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=1200&q=80',
    highlights: ['Handmade', 'Fresh Ingredients', 'No Preservatives'],
    prepTime: '30 mins',
    rating: 4.9,
    reviewCount: 189,
    ingredients: [
      'European butter',
      'Organic flour',
      'Belgian chocolate chips',
      'Pure vanilla bean',
      'Organic brown sugar',
      'Farm-fresh eggs',
      'Sea salt flakes',
    ],
    preparationSteps: [
      {
        step: 1,
        title: 'Cream the Base',
        description: 'Beat premium butter with sugars until pale and creamy.',
      },
      {
        step: 2,
        title: 'Mix Varieties',
        description: 'Prepare three distinct dough batches with unique flavor profiles.',
      },
      {
        step: 3,
        title: 'Shape & Chill',
        description: 'Portion dough, add mix-ins, and chill for optimal texture.',
      },
      {
        step: 4,
        title: 'Bake & Cool',
        description: 'Bake until edges are golden, centers remain soft, then cool on racks.',
      },
    ],
    cookingInstructions: [
      'Store in an airtight container at room temperature for up to 5 days.',
      'Warm in oven at 150°C for 3 minutes for fresh-baked taste.',
      'Can be frozen for up to 2 months.',
    ],
    servingSuggestions: 'Perfect with coffee, tea, or as a gift box for loved ones.',
    customizations: [
      {
        id: 'flavor-mix',
        label: 'Flavor Mix',
        type: 'radio',
        required: true,
        options: [
          { id: 'classic', label: 'Classic Mix (Choc Chip, Double Choc, Oatmeal)', priceModifier: 0 },
          { id: 'premium', label: 'Premium Mix (Matcha, Salted Caramel, Red Velvet)', priceModifier: 80 },
          { id: 'custom', label: 'Pick Your Own (6 flavors)', priceModifier: 100 },
        ],
      },
      {
        id: 'sweetness',
        label: 'Sweetness Level',
        type: 'select',
        required: true,
        options: [
          { id: 'regular', label: 'Regular', priceModifier: 0 },
          { id: 'less-sweet', label: 'Less Sweet', priceModifier: 0 },
        ],
      },
      {
        id: 'quantity',
        label: 'Box Size',
        type: 'radio',
        required: true,
        options: [
          { id: '6', label: '6 Cookies', priceModifier: 0 },
          { id: '12', label: '12 Cookies', priceModifier: 250 },
          { id: '24', label: '24 Cookies', priceModifier: 450 },
        ],
      },
    ],
  },
  {
    id: 'smoothie-bowl',
    name: 'Tropical Smoothie Bowl',
    shortDescription: 'Vibrant acai bowl topped with fresh superfoods',
    description:
      'Start your morning with our vibrant tropical smoothie bowl — thick acai base blended with frozen fruits, topped with granola, coconut flakes, and seasonal fresh fruits.',
    basePrice: 279,
    image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800&q=80',
    heroImage: '',
    videoUrl:
      'https://videos.pexels.com/video-files/4990225/4990225-uhd_2560_1440_25fps.mp4',
    videoPoster: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=1200&q=80',
    highlights: ['Fresh Ingredients', 'No Preservatives', 'Handmade'],
    prepTime: '15 mins',
    rating: 4.8,
    reviewCount: 97,
    ingredients: [
      'Organic acai puree',
      'Frozen mixed berries',
      'Banana',
      'Coconut milk',
      'House-made granola',
      'Fresh mango & kiwi',
      'Chia seeds & bee pollen',
    ],
    preparationSteps: [
      {
        step: 1,
        title: 'Blend the Base',
        description: 'Blend frozen acai, berries, and banana with coconut milk until thick.',
      },
      {
        step: 2,
        title: 'Prepare Toppings',
        description: 'Slice fresh fruits and toast granola with a touch of honey.',
      },
      {
        step: 3,
        title: 'Assemble the Bowl',
        description: 'Pour thick smoothie base and artfully arrange toppings in sections.',
      },
      {
        step: 4,
        title: 'Final Garnish',
        description: 'Finish with chia seeds, bee pollen, and a drizzle of honey.',
      },
    ],
    cookingInstructions: [
      'Best consumed immediately — do not refrigerate for extended periods.',
      'Stir toppings into base for even flavor distribution.',
      'Enjoy within 1 hour of delivery.',
    ],
    servingSuggestions: 'Ideal for breakfast or a refreshing afternoon snack.',
    customizations: [
      {
        id: 'base',
        label: 'Base Flavor',
        type: 'radio',
        required: true,
        options: [
          { id: 'acai', label: 'Classic Acai', priceModifier: 0 },
          { id: 'mango', label: 'Mango Passion', priceModifier: 30 },
          { id: 'pitaya', label: 'Dragon Fruit', priceModifier: 50 },
        ],
      },
      {
        id: 'toppings',
        label: 'Extra Toppings',
        type: 'checkbox',
        options: [
          { id: 'granola', label: 'Extra Granola', priceModifier: 30 },
          { id: 'nut-butter', label: 'Almond Butter Drizzle', priceModifier: 40 },
          { id: 'berries', label: 'Premium Berries', priceModifier: 60 },
        ],
      },
      {
        id: 'size',
        label: 'Size',
        type: 'radio',
        required: true,
        options: [
          { id: 'regular', label: 'Regular', priceModifier: 0 },
          { id: 'large', label: 'Large', priceModifier: 80 },
        ],
      },
    ],
  },
]

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id)
}
