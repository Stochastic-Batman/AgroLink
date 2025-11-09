import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import Navigation from '@/components/Navigation';
import { Plus, LogOut, Package, Edit, Trash2, CreditCard } from 'lucide-react';
import { Session } from '@supabase/supabase-js';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  image_url: string | null;
  is_available: boolean;
  category_id: string;
}

interface Category {
  id: string;
  name_en: string;
  name_ka: string;
}

interface Region {
  id: string;
  name_en: string;
  name_ka: string;
}

const Dashboard = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(true);
  const [addProductOpen, setAddProductOpen] = useState(false);
  const [subscriptionOpen, setSubscriptionOpen] = useState(false);
  const [profileComplete, setProfileComplete] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/auth');
      } else {
        setSession(session);
        checkProfile(session.user.id);
        fetchProducts(session.user.id);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate('/auth');
      } else {
        setSession(session);
      }
    });

    fetchCategories();
    fetchRegions();

    return () => subscription.unsubscribe();
  }, [navigate]);

  const checkProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('region_id')
      .eq('id', userId)
      .single();

    setProfileComplete(!!data?.region_id);
  };

  const fetchProducts = async (userId: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('farmer_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      toast.error(t('Failed to load products', 'პროდუქტების ჩატვირთვა ვერ მოხერხდა'));
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  };

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('*');
    setCategories(data || []);
  };

  const fetchRegions = async () => {
    const { data } = await supabase.from('regions').select('*');
    setRegions(data || []);
  };

  const handleAddProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!session) return;

    const formData = new FormData(e.currentTarget);
    const { error } = await supabase.from('products').insert({
      farmer_id: session.user.id,
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price: parseFloat(formData.get('price') as string),
      unit: formData.get('unit') as string,
      category_id: formData.get('category_id') as string,
    });

    if (error) {
      toast.error(t('Failed to add product', 'პროდუქტის დამატება ვერ მოხერხდა'));
    } else {
      toast.success(t('Product added!', 'პროდუქტი დაემატა!'));
      setAddProductOpen(false);
      fetchProducts(session.user.id);
    }
  };

  const handleUpdateRegion = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!session) return;

    const formData = new FormData(e.currentTarget);
    const { error } = await supabase
      .from('profiles')
      .update({
        region_id: formData.get('region_id') as string,
        phone: formData.get('phone') as string,
        description: formData.get('description') as string,
      })
      .eq('id', session.user.id);

    if (error) {
      toast.error(t('Failed to update profile', 'პროფილის განახლება ვერ მოხერხდა'));
    } else {
      toast.success(t('Profile updated!', 'პროფილი განახლდა!'));
      setProfileComplete(true);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const deleteProduct = async (id: string) => {
    const { error } = await supabase.from('products').delete().eq('id', id);

    if (error) {
      toast.error(t('Failed to delete product', 'პროდუქტის წაშლა ვერ მოხერხდა'));
    } else {
      toast.success(t('Product deleted!', 'პროდუქტი წაიშალა!'));
      if (session) fetchProducts(session.user.id);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">
              {t('Farmer Dashboard', 'ფერმერის დაფა')}
            </h1>
            <p className="text-muted-foreground">
              {t('Manage your products and profile', 'მართეთ თქვენი პროდუქტები და პროფილი')}
            </p>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            {t('Sign Out', 'გასვლა')}
          </Button>
        </div>

        {!profileComplete && (
          <Card className="mb-8 border-2 border-accent">
            <CardHeader>
              <CardTitle>{t('Complete Your Profile', 'შეავსეთ თქვენი პროფილი')}</CardTitle>
              <CardDescription>
                {t('Add your region and details to be discovered by businesses', 'დაამატეთ თქვენი რეგიონი და დეტალები, რომ აღმოგაჩინონ ბიზნესებმა')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateRegion} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="region_id">{t('Region', 'რეგიონი')}</Label>
                  <Select name="region_id" required>
                    <SelectTrigger>
                      <SelectValue placeholder={t('Select region', 'აირჩიეთ რეგიონი')} />
                    </SelectTrigger>
                    <SelectContent>
                      {regions.map((region) => (
                        <SelectItem key={region.id} value={region.id}>
                          {language === 'en' ? region.name_en : region.name_ka}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">{t('Phone', 'ტელეფონი')}</Label>
                  <Input id="phone" name="phone" placeholder="+995..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">{t('Description', 'აღწერა')}</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder={t('Tell businesses about your farm...', 'მოუთხარით ბიზნესებს თქვენი ფერმის შესახებ...')}
                  />
                </div>
                <Button type="submit">{t('Save Profile', 'პროფილის შენახვა')}</Button>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">
            {t('Your Products', 'თქვენი პროდუქტები')}
          </h2>
          <div className="flex gap-2">
            <Dialog open={subscriptionOpen} onOpenChange={setSubscriptionOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <CreditCard className="mr-2 h-4 w-4" />
                  {t('Subscription', 'გამოწერა')}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t('Subscription Plans', 'გამოწერის გეგმები')}</DialogTitle>
                  <DialogDescription>
                    {t('Simple pricing: One monthly rate per category', 'მარტივი ფასი: ერთი ყოველთვიური განაკვეთი კატეგორიაზე')}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <Card className="border-2 border-primary">
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold mb-2">50₾</div>
                        <div className="text-muted-foreground mb-4">
                          {t('per category / month', 'კატეგორიაზე / თვეში')}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {t('Get discovered by local businesses and grow your reach', 'აღმოაჩინოს ადგილობრივმა ბიზნესებმა და გაზარდეთ თქვენი აუდიტორია')}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  <Button className="w-full" disabled>
                    {t('Payment Integration Coming Soon', 'გადახდის ინტეგრაცია მალე')}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={addProductOpen} onOpenChange={setAddProductOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  {t('Add Product', 'პროდუქტის დამატება')}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t('Add New Product', 'ახალი პროდუქტის დამატება')}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddProduct} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="category_id">{t('Category', 'კატეგორია')}</Label>
                    <Select name="category_id" required>
                      <SelectTrigger>
                        <SelectValue placeholder={t('Select category', 'აირჩიეთ კატეგორია')} />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {language === 'en' ? category.name_en : category.name_ka}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name">{t('Product Name', 'პროდუქტის სახელი')}</Label>
                    <Input id="name" name="name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">{t('Description', 'აღწერა')}</Label>
                    <Textarea id="description" name="description" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">{t('Price', 'ფასი')}</Label>
                      <Input id="price" name="price" type="number" step="0.01" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="unit">{t('Unit', 'ერთეული')}</Label>
                      <Input id="unit" name="unit" defaultValue="kg" required />
                    </div>
                  </div>
                  <Button type="submit" className="w-full">
                    {t('Add Product', 'პროდუქტის დამატება')}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">{t('Loading...', 'იტვირთება...')}</p>
          </div>
        ) : products.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">
                {t('No products yet. Add your first product!', 'პროდუქტები ჯერ არ არის. დაამატეთ თქვენი პირველი პროდუქტი!')}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{product.name}</CardTitle>
                      <CardDescription className="mt-2">
                        {product.price}₾ / {product.unit}
                      </CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteProduct(product.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                {product.description && (
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{product.description}</p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
