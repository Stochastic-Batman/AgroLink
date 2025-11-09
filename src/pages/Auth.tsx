import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import Navigation from '@/components/Navigation';
import { z } from 'zod';

const Auth = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const authSchema = z.object({
    email: z.string().email({ message: t('Invalid email address', 'არასწორი ელ.ფოსტა') }),
    password: z.string().min(6, { message: t('Password must be at least 6 characters', 'პაროლი უნდა იყოს მინიმუმ 6 სიმბოლო') }),
    fullName: z.string().min(2, { message: t('Name must be at least 2 characters', 'სახელი უნდა იყოს მინიმუმ 2 სიმბოლო') }).optional(),
  });

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const fullName = formData.get('fullName') as string;

    try {
      const validation = authSchema.parse({ email, password, fullName });

      const { error } = await supabase.auth.signUp({
        email: validation.email,
        password: validation.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: validation.fullName,
          },
        },
      });

      if (error) throw error;

      toast.success(t('Account created successfully!', 'ანგარიში წარმატებით შეიქმნა!'));
      navigate('/dashboard');
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error(error.message || t('Failed to create account', 'ანგარიშის შექმნა ვერ მოხერხდა'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const validation = authSchema.parse({ email, password });

      const { error } = await supabase.auth.signInWithPassword({
        email: validation.email,
        password: validation.password,
      });

      if (error) throw error;

      toast.success(t('Signed in successfully!', 'წარმატებით შეხვედით!'));
      navigate('/dashboard');
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error(error.message || t('Failed to sign in', 'შესვლა ვერ მოხერხდა'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 pt-32 pb-16 flex items-center justify-center">
        <Card className="w-full max-w-md shadow-soft">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              {t('Welcome to RandomRouting', 'კეთილი იყოს თქვენი მობრძანება RandomRouting-ში')}
            </CardTitle>
            <CardDescription className="text-center">
              {t('Join our community of farmers and businesses', 'შეუერთდით ფერმერებისა და ბიზნესების ჩვენს საზოგადოებას')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signup" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signup">{t('Sign Up', 'რეგისტრაცია')}</TabsTrigger>
                <TabsTrigger value="signin">{t('Sign In', 'შესვლა')}</TabsTrigger>
              </TabsList>

              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">{t('Full Name', 'სრული სახელი')}</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      placeholder={t('Enter your full name', 'შეიყვანეთ თქვენი სრული სახელი')}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">{t('Email', 'ელ.ფოსტა')}</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder={t('Enter your email', 'შეიყვანეთ თქვენი ელ.ფოსტა')}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">{t('Password', 'პაროლი')}</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder={t('Create a password', 'შექმენით პაროლი')}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? t('Creating...', 'იქმნება...') : t('Create Account', 'ანგარიშის შექმნა')}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">{t('Email', 'ელ.ფოსტა')}</Label>
                    <Input
                      id="signin-email"
                      name="email"
                      type="email"
                      placeholder={t('Enter your email', 'შეიყვანეთ თქვენი ელ.ფოსტა')}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">{t('Password', 'პაროლი')}</Label>
                    <Input
                      id="signin-password"
                      name="password"
                      type="password"
                      placeholder={t('Enter your password', 'შეიყვანეთ თქვენი პაროლი')}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? t('Signing in...', 'შესვლა...') : t('Sign In', 'შესვლა')}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
