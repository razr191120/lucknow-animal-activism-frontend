import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { oauthInstagram } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';

/** Handles redirect from Instagram OAuth (Basic Display). */
export default function InstagramCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const [msg, setMsg] = useState('Signing you in…');

  useEffect(() => {
    const code = params.get('code');
    const err = params.get('error') || params.get('error_reason');
    if (err) {
      setMsg(`Instagram error: ${err}`);
      setTimeout(() => navigate('/login', { replace: true }), 2500);
      return;
    }
    if (!code) {
      setMsg('Missing authorization code.');
      setTimeout(() => navigate('/login', { replace: true }), 2500);
      return;
    }
    (async () => {
      try {
        const data = await oauthInstagram({ code });
        setAuth(data.access_token, data.user);
        navigate('/', { replace: true });
      } catch (e: unknown) {
        const ax = e as { response?: { data?: { detail?: string } } };
        setMsg(ax.response?.data?.detail ?? 'Instagram sign-in failed');
        setTimeout(() => navigate('/login', { replace: true }), 3000);
      }
    })();
  }, [params, navigate, setAuth]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-pink-50 px-4">
      <div className="text-center max-w-md">
        <LoadingSpinner message={msg} />
      </div>
    </div>
  );
}
