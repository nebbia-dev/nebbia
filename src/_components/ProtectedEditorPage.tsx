import { type FormEvent, useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ProjectEditorPage } from './ProjectEditorPage';
import { authSessionQueryOptions, signInWithPassword, signOut } from '../supabaseAuth';
import { supabase } from '../supabaseClient';
import { usePageMeta } from '../usePageMeta';

const fieldClass = 'h-14 w-full border border-white/20 bg-transparent px-4 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-[#ff3700]';

function authErrorMessage(error: unknown) {
  if (!(error instanceof Error)) return 'Accesso non riuscito. Riprova.';
  if (/invalid login credentials/i.test(error.message)) return 'Email o password non corretti.';
  if (/email not confirmed/i.test(error.message)) return 'Conferma il tuo indirizzo email prima di accedere.';
  return error.message;
}

function LoginPage() {
  const queryClient = useQueryClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const loginMutation = useMutation({
    mutationFn: () => signInWithPassword(email.trim(), password),
    onSuccess: (session) => {
      queryClient.setQueryData(authSessionQueryOptions.queryKey, session);
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    loginMutation.mutate();
  };

  return (
    <main className="grid min-h-screen bg-[#151515] text-white lg:grid-cols-2">
      <section className="flex min-h-[42dvh] flex-col justify-between border-b border-white/10 p-5 sm:p-8 lg:min-h-screen lg:border-r lg:border-b-0">
        <a className="w-fit text-xl font-semibold" href="/" aria-label="Torna al sito Nebbia">nebbia.</a>
        <div className="max-w-xl py-14 lg:py-0">
          <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.08em] text-white/40">Area riservata</p>
          <h1 className="text-[clamp(3rem,7vw,7rem)] font-extralight leading-[0.9] tracking-[-0.055em]">Project<br />editor.</h1>
        </div>
        <p className="hidden max-w-sm text-xs leading-relaxed text-white/35 lg:block">Gestisci i contenuti e i media dei progetti Nebbia.</p>
      </section>

      <section className="flex items-center justify-center px-5 py-14 sm:px-8 lg:px-16">
        <form className="w-full max-w-md" onSubmit={handleSubmit}>
          <p className="text-[10px] font-medium uppercase tracking-[0.08em] text-white/40">Login</p>
          <h2 className="mt-3 text-3xl font-extralight tracking-[-0.03em]">Accedi all’editor</h2>
          <p className="mt-3 text-sm leading-relaxed text-white/45">Inserisci le credenziali del tuo account Supabase.</p>

          <div className="mt-10">
            <label className="block">
              <span className="sr-only">Email</span>
              <input
                className={fieldClass}
                type="email"
                name="email"
                autoComplete="email"
                placeholder="Email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </label>
            <label className="-mt-px block">
              <span className="sr-only">Password</span>
              <input
                className={fieldClass}
                type="password"
                name="password"
                autoComplete="current-password"
                placeholder="Password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </label>
          </div>

          {loginMutation.isError && (
            <p className="mt-4 border-l-2 border-[#ff3700] pl-3 text-xs leading-relaxed text-[#ff8c70]" role="alert">
              {authErrorMessage(loginMutation.error)}
            </p>
          )}

          <button
            className="mt-6 flex h-14 w-full items-center justify-between bg-white px-4 text-xs font-medium uppercase text-[#1a1a1a] transition hover:bg-[#ff3700] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            type="submit"
            disabled={loginMutation.isPending}
          >
            <span>{loginMutation.isPending ? 'Accesso in corso…' : 'Accedi'}</span>
            <span aria-hidden="true">→</span>
          </button>
        </form>
      </section>
    </main>
  );
}

function AuthLoadState({ message }: { message: string }) {
  return (
    <main className="grid min-h-screen place-items-center bg-[#151515] px-6 text-center text-sm text-white/55">
      {message}
    </main>
  );
}

export function ProtectedEditorPage() {
  usePageMeta('Project editor — Nebbia', 'Area riservata per la gestione dei progetti Nebbia.');

  const queryClient = useQueryClient();
  const sessionQuery = useQuery(authSessionQueryOptions);
  const logoutMutation = useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      queryClient.setQueryData(authSessionQueryOptions.queryKey, null);
      queryClient.removeQueries({ queryKey: ['supabase', 'projects'] });
    },
  });

  useEffect(() => {
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      queryClient.setQueryData(authSessionQueryOptions.queryKey, session);
      if (!session) queryClient.removeQueries({ queryKey: ['supabase', 'projects'] });
    });

    return () => subscription.subscription.unsubscribe();
  }, [queryClient]);

  if (sessionQuery.isPending) return <AuthLoadState message="Verifica della sessione…" />;

  if (sessionQuery.isError) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#151515] px-6 text-center text-white">
        <div>
          <p className="text-sm text-white/55">Non è stato possibile verificare la sessione.</p>
          <button className="mt-4 border border-white/20 px-4 py-2 text-xs uppercase transition hover:border-[#ff3700] hover:text-[#ff3700]" type="button" onClick={() => sessionQuery.refetch()}>Riprova</button>
        </div>
      </main>
    );
  }

  if (!sessionQuery.data) return <LoginPage />;

  return (
    <ProjectEditorPage
      authEmail={sessionQuery.data.user.email ?? ''}
      isSigningOut={logoutMutation.isPending}
      onSignOut={() => logoutMutation.mutate()}
    />
  );
}
