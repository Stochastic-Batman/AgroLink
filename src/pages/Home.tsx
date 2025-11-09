import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import heroBg from '@/assets/hero-bg.jpg';
import { Wine, Milk, Grape, Droplets, Users, TrendingUp, Map } from 'lucide-react';

const Home = () => {
  const { t } = useLanguage();

  const categories = [
    { icon: Milk, name: t('Cheese & Dairy', 'ყველი და რძის პროდუქტები'), color: 'text-accent' },
    { icon: Wine, name: t('Wine', 'ღვინო'), color: 'text-primary' },
    { icon: Grape, name: t('Grapes', 'ყურძენი'), color: 'text-secondary' },
    { icon: Droplets, name: t('Honey', 'თაფლი'), color: 'text-accent' },
  ];

  const features = [
    {
      icon: Users,
      title: t('Connect Directly', 'პირდაპირი კავშირი'),
      description: t(
        'Build lasting partnerships between farmers and businesses',
        'შექმენით გრძელვადიანი პარტნიორობა ფერმერებსა და ბიზნესებს შორის'
      ),
    },
    {
      icon: TrendingUp,
      title: t('Grow Together', 'ერთად ზრდა'),
      description: t(
        'Support local agriculture and boost regional economy',
        'მხარი დაუჭირეთ ადგილობრივ სოფლის მეურნეობას და გაზარდეთ რეგიონული ეკონომიკა'
      ),
    },
    {
      icon: Map,
      title: t('Regional Focus', 'რეგიონული ფოკუსი'),
      description: t(
        'Find farmers from every region of Georgia',
        'იპოვეთ ფერმერები საქართველოს ყველა რეგიონიდან'
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBg})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background" />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            <span className="block text-foreground mb-2">
              {t('Connecting Georgian Farmers', 'საქართველოს ფერმერებს ვაერთებთ')}
            </span>
            <span className="block bg-gradient-hero bg-clip-text text-transparent">
              {t('with Local Businesses', 'ადგილობრივ ბიზნესებთან')}
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-slide-up">
            {t(
              'Empowering Georgia\'s agricultural community through direct connections',
              'საქართველოს სასოფლო-სამეურნეო საზოგადოების გაძლიერება პირდაპირი კავშირების საშუალებით'
            )}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
            <Link to="/auth">
              <Button size="lg" className="text-lg px-8 shadow-glow">
                {t('Join as a Farmer', 'გაწევრიანება როგორც ფერმერი')}
              </Button>
            </Link>
            <Link to="/farmers">
              <Button size="lg" variant="outline" className="text-lg px-8 border-2">
                {t('Browse Farmers', 'ფერმერების ნახვა')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            {t('Product Categories', 'პროდუქტის კატეგორიები')}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary/50">
                <CardContent className="p-6 text-center">
                  <category.icon className={`w-12 h-12 mx-auto mb-4 ${category.color}`} />
                  <h3 className="font-semibold">{category.name}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            {t('Why RandomRouting?', 'რატომ RandomRouting?')}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center border-2 hover:border-primary/50 transition-colors">
                <CardContent className="p-8">
                  <feature.icon className="w-12 h-12 mx-auto mb-4 text-primary" />
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {t(
              'Ready to grow your business?',
              'მზად ხართ თქვენი ბიზნესის გასაზრდელად?'
            )}
          </h2>
          <p className="text-xl mb-8 opacity-90">
            {t(
              'Join hundreds of farmers connecting with local businesses',
              'შეუერთდით ასობით ფერმერს, რომლებიც უკავშირდებიან ადგილობრივ ბიზნესებს'
            )}
          </p>
          <Link to="/auth">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              {t('Get Started Today', 'დაიწყეთ დღეს')}
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2024 RandomRouting. {t('All rights reserved.', 'ყველა უფლება დაცულია.')}</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
