
import dynamic from 'next/dynamic';
const AuthUI = dynamic(()=>import('@/components/Auth'), { ssr:false });

export default function AuthPage(){
  return <AuthUI />;
}
