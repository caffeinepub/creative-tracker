import { Outlet, Link, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

export function Layout() {
  const navigate = useNavigate();
  const { identity, login, clear, isLoginSuccess } = useInternetIdentity();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-serif font-bold text-lg">C</span>
              </div>
              <div>
                <h1 className="text-2xl font-serif font-bold text-foreground group-hover:text-primary transition-colors">
                  Creative Tracker
                </h1>
                <p className="text-xs text-muted-foreground">Amazon Marketing Agency</p>
              </div>
            </Link>
            <div className="flex items-center gap-3">
              {isLoginSuccess && identity ? (
                <>
                  <Button
                    onClick={() => navigate({ to: '/create' })}
                    className="gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    New Project
                  </Button>
                  <Button onClick={clear} variant="outline">
                    Logout
                  </Button>
                </>
              ) : (
                <Button onClick={login}>Login</Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-border bg-card/30 mt-auto">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Creative Tracker. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground">
              Built with ❤️ using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                  typeof window !== 'undefined' ? window.location.hostname : 'creative-tracker'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground hover:text-primary transition-colors font-medium"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
