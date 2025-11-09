import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Globe, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';

const Navigation = () => {
  const { language, setLanguage, t } = useLanguage();
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ka' : 'en');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            RandomRouting
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <Link to="/farmers">
            <Button variant="ghost">
              {t('Browse Farmers', 'ფერმერების ნახვა')}
            </Button>
          </Link>

          <Button variant="ghost" size="icon" onClick={toggleLanguage}>
            <Globe className="h-5 w-5" />
          </Button>

          {session ? (
            <Link to="/dashboard">
              <Button variant="default">
                <User className="mr-2 h-4 w-4" />
                {t('Dashboard', 'დაფა')}
              </Button>
            </Link>
          ) : (
            <Link to="/auth">
              <Button variant="default">
                {t('Join as Farmer', 'გაწევრიანება')}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
