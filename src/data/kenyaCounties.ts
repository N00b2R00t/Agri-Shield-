export interface KenyaCounty {
  code: string;
  name: string;
  capital: string;
  region: 'Coast' | 'Rift Valley' | 'Central' | 'Eastern' | 'Nyanza' | 'Western' | 'North Eastern' | 'Nairobi';
  primaryAgri: string;
  lat: number;
  lng: number;
}

export const KENYA_COUNTIES: KenyaCounty[] = [
  { code: '001', name: 'Mombasa', capital: 'Mombasa', region: 'Coast', primaryAgri: 'Cassava, Coconut, Coastal Fisheries & Port Trade', lat: -4.0437, lng: 39.6682 },
  { code: '002', name: 'Kwale', capital: 'Kwale', region: 'Coast', primaryAgri: 'Cashew Nuts, Coconuts, Cassava & Sugarcane', lat: -4.1737, lng: 39.4521 },
  { code: '003', name: 'Kilifi', capital: 'Kilifi', region: 'Coast', primaryAgri: 'Cashew, Coconut, Mangoes & Dairy', lat: -3.6307, lng: 39.8499 },
  { code: '004', name: 'Tana River', capital: 'Hola', region: 'Coast', primaryAgri: 'Irrigated Mangoes, Rice, Watermelon & Pastoralism', lat: -1.5000, lng: 39.0000 },
  { code: '005', name: 'Lamu', capital: 'Lamu', region: 'Coast', primaryAgri: 'Cotton, Sesame, Coconut & Marine Fisheries', lat: -2.2717, lng: 40.9020 },
  { code: '006', name: 'Taita–Taveta', capital: 'Voi / Wundanyi', region: 'Coast', primaryAgri: 'Horticulture, Bananas, Macadamia & Beef Ranching', lat: -3.3968, lng: 38.5564 },
  { code: '007', name: 'Garissa', capital: 'Garissa', region: 'North Eastern', primaryAgri: 'Camel, Goat & Cattle Pastoralism, Riverine Fruits', lat: -0.4532, lng: 39.6461 },
  { code: '008', name: 'Wajir', capital: 'Wajir', region: 'North Eastern', primaryAgri: 'Camel Milk, Sheep & Goat Pastoralism, Sorghum', lat: 1.7471, lng: 40.0573 },
  { code: '009', name: 'Mandera', capital: 'Mandera', region: 'North Eastern', primaryAgri: 'Camels, Goats, Sesame & Irrigated Watermelons', lat: 3.9373, lng: 41.8569 },
  { code: '010', name: 'Marsabit', capital: 'Marsabit', region: 'Eastern', primaryAgri: 'Livestock Pastoralism, Coffee (Mt Marsabit), Sorghum', lat: 2.3284, lng: 37.9899 },
  { code: '011', name: 'Isiolo', capital: 'Isiolo', region: 'Eastern', primaryAgri: 'Beef Cattle, Camels, Hay Fodder & Apiculture', lat: 0.3546, lng: 37.5822 },
  { code: '012', name: 'Meru', capital: 'Meru', region: 'Eastern', primaryAgri: 'Coffee, Tea, Bananas, Miraa & Horticulture', lat: 0.0470, lng: 37.6498 },
  { code: '013', name: 'Tharaka-Nithi', capital: 'Kathwana', region: 'Eastern', primaryAgri: 'Green Grams, Sorghum, Coffee & Dairy', lat: -0.2982, lng: 37.8767 },
  { code: '014', name: 'Embu', capital: 'Embu', region: 'Eastern', primaryAgri: 'Tea, Coffee, Macadamia, Maize & Dairy', lat: -0.5342, lng: 37.4578 },
  { code: '015', name: 'Kitui', capital: 'Kitui', region: 'Eastern', primaryAgri: 'Green Grams (Ndengu), Sorghum, Beekeeping & Goats', lat: -1.3670, lng: 38.0106 },
  { code: '016', name: 'Machakos', capital: 'Machakos', region: 'Eastern', primaryAgri: 'Coffee, Maize, Beans, Fruit Orchards & Poultry', lat: -1.5177, lng: 37.2634 },
  { code: '017', name: 'Makueni', capital: 'Wote', region: 'Eastern', primaryAgri: 'Mangoes, Citrus Fruits, Pulses & Goat Farming', lat: -1.7808, lng: 37.6288 },
  { code: '018', name: 'Nyandarua', capital: 'Ol Kalou', region: 'Central', primaryAgri: 'Irish Potatoes, Fresh Vegetables, Dairy & Pyrethrum', lat: -0.2711, lng: 36.3782 },
  { code: '019', name: 'Nyeri', capital: 'Nyeri', region: 'Central', primaryAgri: 'Highland Coffee, Specialty Tea, Dairy & Cut Flowers', lat: -0.4201, lng: 36.9476 },
  { code: '020', name: 'Kirinyaga', capital: 'Kerugoya', region: 'Central', primaryAgri: 'Mwea Paddy Rice, Coffee, Tea & Tomatoes', lat: -0.5000, lng: 37.2833 },
  { code: '021', name: "Murang'a", capital: "Murang'a", region: 'Central', primaryAgri: 'Avocados (Hass), Coffee, Tea & Macadamia', lat: -0.7210, lng: 37.1526 },
  { code: '022', name: 'Kiambu', capital: 'Kiambu', region: 'Central', primaryAgri: 'Dairy Farming, Coffee Estates, Poultry & Greenhouses', lat: -1.1714, lng: 36.8356 },
  { code: '023', name: 'Turkana', capital: 'Lodwar', region: 'Rift Valley', primaryAgri: 'Pastoralism, Sorghum, Irrigation Schemes (Katilu)', lat: 3.1191, lng: 35.5973 },
  { code: '024', name: 'West Pokot', capital: 'Kapenguria', region: 'Rift Valley', primaryAgri: 'Beef & Dairy Cattle, Maize, Onions & Honey', lat: 1.2389, lng: 35.1119 },
  { code: '025', name: 'Samburu', capital: 'Maralal', region: 'Rift Valley', primaryAgri: 'Pastoral Livestock, Honey, Indigenous Poultry', lat: 1.0968, lng: 36.6980 },
  { code: '026', name: 'Trans Nzoia', capital: 'Kitale', region: 'Rift Valley', primaryAgri: 'Commercial Maize Grain Belt, Seed Maize & Dairy', lat: 1.0157, lng: 35.0023 },
  { code: '027', name: 'Uasin Gishu', capital: 'Eldoret', region: 'Rift Valley', primaryAgri: 'Large-scale Maize, Wheat, Intensive Dairy & Passion Fruit', lat: 0.5143, lng: 35.2698 },
  { code: '028', name: 'Elgeyo-Marakwet', capital: 'Iten', region: 'Rift Valley', primaryAgri: 'Potatoes, Vegetables, Dairy & Highland Fruit Orchards', lat: 0.6737, lng: 35.5082 },
  { code: '029', name: 'Nandi', capital: 'Kapsabet', region: 'Rift Valley', primaryAgri: 'Highland Tea, Commercial Dairy, Maize & Coffee', lat: 0.2039, lng: 35.0931 },
  { code: '030', name: 'Baringo', capital: 'Kabarnet', region: 'Rift Valley', primaryAgri: 'Honey (Baringo Honey), Goats, Irrigation Cotton & Maize', lat: 0.4905, lng: 35.7430 },
  { code: '031', name: 'Laikipia', capital: 'Rumuruti / Nanyuki', region: 'Rift Valley', primaryAgri: 'Beef Ranching, Wheat, Cut Flowers & Vegetables', lat: 0.3606, lng: 36.7820 },
  { code: '032', name: 'Nakuru', capital: 'Nakuru', region: 'Rift Valley', primaryAgri: 'Flowers (Naivasha), Pyrethrum, Potatoes, Maize & Dairy', lat: -0.3031, lng: 36.0800 },
  { code: '033', name: 'Narok', capital: 'Narok', region: 'Rift Valley', primaryAgri: 'Wheat Belt, Barley, Maize & Livestock Grazing', lat: -1.0833, lng: 35.8667 },
  { code: '034', name: 'Kajiado', capital: 'Kajiado', region: 'Rift Valley', primaryAgri: 'Beef Cattle, Goats, Commercial Floriculture & Tomatoes', lat: -1.8531, lng: 36.7768 },
  { code: '035', name: 'Kericho', capital: 'Kericho', region: 'Rift Valley', primaryAgri: 'Black Tea Plantations, Dairy, Pineapple & Sugarcane', lat: -0.3692, lng: 35.2863 },
  { code: '036', name: 'Bomet', capital: 'Bomet', region: 'Rift Valley', primaryAgri: 'Tea, Milk Production, Maize & Sweet Potatoes', lat: -0.7813, lng: 35.3416 },
  { code: '037', name: 'Kakamega', capital: 'Kakamega', region: 'Western', primaryAgri: 'Sugarcane, Maize, Tea & Indigenous Vegetables', lat: 0.2827, lng: 34.7519 },
  { code: '038', name: 'Vihiga', capital: 'Mbale', region: 'Western', primaryAgri: 'Tea, Bananas, Dairy Goats & Indigenous Vegetables', lat: 0.0772, lng: 34.7223 },
  { code: '039', name: 'Bungoma', capital: 'Bungoma', region: 'Western', primaryAgri: 'Sugarcane, Maize, Coffee, Sunflower & Poultry', lat: 0.5635, lng: 34.5606 },
  { code: '040', name: 'Busia', capital: 'Busia', region: 'Western', primaryAgri: 'Cassava, Sweet Potatoes, Groundnuts & Rice', lat: 0.4608, lng: 34.1115 },
  { code: '041', name: 'Siaya', capital: 'Siaya', region: 'Nyanza', primaryAgri: 'Cotton, Sorghum, Cassava & Fish Farming', lat: -0.0607, lng: 34.2882 },
  { code: '042', name: 'Kisumu', capital: 'Kisumu', region: 'Nyanza', primaryAgri: 'Lake Fisheries, Irrigated Rice (Kano Plains) & Sugarcane', lat: -0.1022, lng: 34.7617 },
  { code: '043', name: 'Homa Bay', capital: 'Homa Bay', region: 'Nyanza', primaryAgri: 'Pineapples, Groundnuts, Cotton, Tilapia Fisheries', lat: -0.5273, lng: 34.4571 },
  { code: '044', name: 'Migori', capital: 'Migori', region: 'Nyanza', primaryAgri: 'Tobacco, Sugarcane, Sweet Potatoes & Maize', lat: -1.0634, lng: 34.4731 },
  { code: '045', name: 'Kisii', capital: 'Kisii', region: 'Nyanza', primaryAgri: 'Bananas, Tea, Coffee, Maize & Avocado', lat: -0.6817, lng: 34.7667 },
  { code: '046', name: 'Nyamira', capital: 'Nyamira', region: 'Nyanza', primaryAgri: 'Highland Tea, Bananas, Dairy & Coffee', lat: -0.5633, lng: 34.9358 },
  { code: '047', name: 'Nairobi', capital: 'Nairobi', region: 'Nairobi', primaryAgri: 'Urban Hydroponics, Poultry, Dairy Processing & Agri-Logistics', lat: -1.2921, lng: 36.8219 },
];

export const getCountyByCode = (code: string): KenyaCounty | undefined => {
  return KENYA_COUNTIES.find((c) => c.code === code);
};

export const getCountyByName = (name: string): KenyaCounty | undefined => {
  if (!name) return undefined;
  const normalized = name.trim().toLowerCase();
  return KENYA_COUNTIES.find(
    (c) => c.name.toLowerCase() === normalized || normalized.includes(c.name.toLowerCase())
  );
};
