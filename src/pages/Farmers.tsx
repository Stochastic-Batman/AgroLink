import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import { Search, Mail, MapPin, Package } from 'lucide-react';

interface Farmer {
  id: string;
  full_name: string;
  email: string;
  description: string | null;
  phone: string | null;
  region_id: string | null;
}

interface Region {
  id: string;
  name_en: string;
  name_ka: string;
}

interface Category {
  id: string;
  name_en: string;
  name_ka: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  unit: string;
  category_id: string;
}

const Farmers = () => {
  const { t, language } = useLanguage();
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Record<string, Product[]>>({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);

    // Fetch farmers
    const { data: farmersData } = await supabase
      .from('profiles')
      .select('*')
      .not('region_id', 'is', null);

    // Fetch regions
    const { data: regionsData } = await supabase.from('regions').select('*');

    // Fetch categories
    const { data: categoriesData } = await supabase.from('categories').select('*');

    // Fetch products
    const { data: productsData } = await supabase
      .from('products')
      .select('*')
      .eq('is_available', true);

    setFarmers(farmersData || []);
    setRegions(regionsData || []);
    setCategories(categoriesData || []);

    // Group products by farmer
    const productsByFarmer: Record<string, Product[]> = {};
    productsData?.forEach((product) => {
      if (!productsByFarmer[product.farmer_id]) {
        productsByFarmer[product.farmer_id] = [];
      }
      productsByFarmer[product.farmer_id].push(product);
    });
    setProducts(productsByFarmer);

    setLoading(false);
  };

  const getRegionName = (regionId: string | null) => {
    if (!regionId) return '';
    const region = regions.find((r) => r.id === regionId);
    return region ? (language === 'en' ? region.name_en : region.name_ka) : '';
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    return category ? (language === 'en' ? category.name_en : category.name_ka) : '';
  };

  const filteredFarmers = farmers.filter((farmer) => {
    const matchesSearch =
      farmer.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      farmer.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRegion = selectedRegion === 'all' || farmer.region_id === selectedRegion;

    const farmerProducts = products[farmer.id] || [];
    const matchesCategory =
      selectedCategory === 'all' ||
      farmerProducts.some((p) => p.category_id === selectedCategory);

    return matchesSearch && matchesRegion && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">
            {t('Discover Georgian Farmers', 'აღმოაჩინეთ ქართველი ფერმერები')}
          </h1>
          <p className="text-xl text-muted-foreground">
            {t(
              'Connect with local producers from every region',
              'დაუკავშირდით ადგილობრივ მწარმოებლებს ყველა რეგიონიდან'
            )}
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8 shadow-soft">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t('Search farmers...', 'მოძებნეთ ფერმერები...')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger>
                  <SelectValue placeholder={t('All Regions', 'ყველა რეგიონი')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('All Regions', 'ყველა რეგიონი')}</SelectItem>
                  {regions.map((region) => (
                    <SelectItem key={region.id} value={region.id}>
                      {language === 'en' ? region.name_en : region.name_ka}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder={t('All Categories', 'ყველა კატეგორია')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('All Categories', 'ყველა კატეგორია')}</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {language === 'en' ? category.name_en : category.name_ka}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Farmers Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">{t('Loading...', 'იტვირთება...')}</p>
          </div>
        ) : filteredFarmers.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                {t('No farmers found matching your criteria', 'მოცემული კრიტერიუმების შესაბამისი ფერმერები არ მოიძებნა')}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFarmers.map((farmer) => {
              const farmerProducts = products[farmer.id] || [];
              return (
                <Card key={farmer.id} className="hover:shadow-lg transition-shadow border-2 hover:border-primary/50">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl">{farmer.full_name}</CardTitle>
                        {farmer.region_id && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                            <MapPin className="h-3 w-3" />
                            {getRegionName(farmer.region_id)}
                          </div>
                        )}
                      </div>
                    </div>
                    {farmer.description && (
                      <CardDescription className="mt-3">{farmer.description}</CardDescription>
                    )}
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {farmerProducts.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold mb-2">
                          {t('Products', 'პროდუქტები')}
                        </h4>
                        <div className="space-y-2">
                          {farmerProducts.slice(0, 3).map((product) => (
                            <div
                              key={product.id}
                              className="flex justify-between items-center text-sm"
                            >
                              <span className="text-muted-foreground">
                                {product.name}
                                <span className="text-xs ml-1">
                                  ({getCategoryName(product.category_id)})
                                </span>
                              </span>
                              <span className="font-medium">
                                {product.price}₾/{product.unit}
                              </span>
                            </div>
                          ))}
                          {farmerProducts.length > 3 && (
                            <p className="text-xs text-muted-foreground">
                              +{farmerProducts.length - 3} {t('more', 'მეტი')}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    <Button className="w-full" asChild>
                      <a href={`mailto:${farmer.email}`}>
                        <Mail className="mr-2 h-4 w-4" />
                        {t('Contact Farmer', 'დაუკავშირდით ფერმერს')}
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Farmers;
