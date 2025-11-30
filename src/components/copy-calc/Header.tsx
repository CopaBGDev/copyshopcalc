import { Logo } from "./Logo";

export function Header() {
  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo />
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              Copy<span className="text-primary">Calc</span>
            </h1>
          </div>
        </div>
      </div>
    </header>
  );
}
