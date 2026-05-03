import { useCallback, useEffect, useRef, useState } from 'react';
import type { TokenResponse } from '../api/types';
import { oauthFacebook, oauthGoogle } from '../api/client';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (resp: { credential: string }) => void;
          }) => void;
          renderButton: (el: HTMLElement, opts: Record<string, unknown>) => void;
        };
      };
    };
    FB?: {
      init: (opts: Record<string, unknown>) => void;
      login: (
        cb: (r: { authResponse?: { accessToken: string } }) => void,
        opts: { scope: string },
      ) => void;
    };
    fbAsyncInit?: () => void;
  }
}

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
const facebookAppId = import.meta.env.VITE_FACEBOOK_APP_ID || '';
const instagramClientId = import.meta.env.VITE_INSTAGRAM_CLIENT_ID || '';
const instagramRedirect =
  import.meta.env.VITE_INSTAGRAM_REDIRECT_URI ||
  `${window.location.origin}/oauth/instagram`;

type Props = {
  onSuccess: (data: TokenResponse) => void;
  onError: (msg: string) => void;
};

export default function SocialLoginButtons({ onSuccess, onError }: Props) {
  const googleDivRef = useRef<HTMLDivElement>(null);
  const [fbReady, setFbReady] = useState(false);
  const [working, setWorking] = useState<string | null>(null);

  const handleGoogleCredential = useCallback(
    async (credential: string) => {
      setWorking('google');
      try {
        const data = await oauthGoogle(credential);
        onSuccess(data);
      } catch (e: unknown) {
        const ax = e as { response?: { data?: { detail?: string } } };
        onError(ax.response?.data?.detail ?? 'Google sign-in failed');
      } finally {
        setWorking(null);
      }
    },
    [onSuccess, onError],
  );

  useEffect(() => {
    if (!googleClientId || !googleDivRef.current) return;
    const s = document.createElement('script');
    s.src = 'https://accounts.google.com/gsi/client';
    s.async = true;
    s.onload = () => {
      if (!window.google?.accounts?.id || !googleDivRef.current) return;
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: (resp) => {
          if (resp.credential) void handleGoogleCredential(resp.credential);
        },
      });
      window.google.accounts.id.renderButton(googleDivRef.current, {
        theme: 'outline',
        size: 'large',
        width: 320,
        text: 'continue_with',
      });
    };
    document.body.appendChild(s);
    return () => {
      s.remove();
    };
  }, [handleGoogleCredential]);

  useEffect(() => {
    if (!facebookAppId) return;
    window.fbAsyncInit = () => {
      window.FB?.init({
        appId: facebookAppId,
        cookie: true,
        xfbml: false,
        version: 'v21.0',
      });
      setFbReady(true);
    };
    const s = document.createElement('script');
    s.src = 'https://connect.facebook.net/en_US/sdk.js';
    s.async = true;
    s.defer = true;
    s.crossOrigin = 'anonymous';
    document.body.appendChild(s);
    return () => {
      s.remove();
    };
  }, []);

  async function handleFacebook() {
    if (!window.FB) {
      onError('Facebook SDK not loaded yet');
      return;
    }
    setWorking('facebook');
    window.FB.login(
      async (r) => {
        const tok = r.authResponse?.accessToken;
        if (!tok) {
          setWorking(null);
          onError('Facebook login was cancelled');
          return;
        }
        try {
          const data = await oauthFacebook(tok);
          onSuccess(data);
        } catch (e: unknown) {
          const ax = e as { response?: { data?: { detail?: string } } };
          onError(ax.response?.data?.detail ?? 'Facebook sign-in failed');
        } finally {
          setWorking(null);
        }
      },
      { scope: 'public_profile,email' },
    );
  }

  function handleInstagram() {
    if (!instagramClientId) {
      onError('Instagram is not configured (set VITE_INSTAGRAM_CLIENT_ID)');
      return;
    }
    const u = new URL('https://api.instagram.com/oauth/authorize');
    u.searchParams.set('client_id', instagramClientId);
    u.searchParams.set('redirect_uri', instagramRedirect);
    u.searchParams.set('scope', 'user_profile');
    u.searchParams.set('response_type', 'code');
    window.location.href = u.toString();
  }

  return (
    <div className="space-y-3">
      <p className="text-center text-xs text-gray-500 uppercase tracking-wide">
        Or continue with
      </p>
      {googleClientId ? (
        <div ref={googleDivRef} className="flex justify-center min-h-[40px]" />
      ) : (
        <p className="text-center text-xs text-amber-700">
          Google sign-in: set <code className="bg-amber-50 px-1 rounded">VITE_GOOGLE_CLIENT_ID</code>
        </p>
      )}
      {facebookAppId ? (
        <button
          type="button"
          disabled={!fbReady || working !== null}
          onClick={() => void handleFacebook()}
          className="w-full py-2.5 rounded-lg bg-[#1877F2] text-white font-semibold text-sm hover:bg-[#166fe5] disabled:opacity-50 transition-colors"
        >
          {working === 'facebook' ? 'Connecting…' : 'Facebook'}
        </button>
      ) : (
        <p className="text-center text-xs text-gray-400">
          Facebook: set <code className="bg-gray-100 px-1 rounded">VITE_FACEBOOK_APP_ID</code>
        </p>
      )}
      <button
        type="button"
        disabled={working !== null || !instagramClientId}
        onClick={handleInstagram}
        className="w-full py-2.5 rounded-lg bg-gradient-to-r from-[#f09433] via-[#e6683c] to-[#dc2743] text-white font-semibold text-sm hover:opacity-95 disabled:opacity-40 transition-opacity"
        title={
          instagramClientId
            ? 'Uses Instagram Basic Display (redirect)'
            : 'Configure Instagram client id'
        }
      >
        Instagram
      </button>
      {!instagramClientId && (
        <p className="text-center text-xs text-gray-400">
          Instagram: set <code className="bg-gray-100 px-1 rounded">VITE_INSTAGRAM_CLIENT_ID</code>{' '}
          and matching redirect in Meta / Instagram app settings.
        </p>
      )}
    </div>
  );
}
