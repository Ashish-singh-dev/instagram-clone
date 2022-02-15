import type { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAuth } from "../utils/AuthProvider";
import InstagramLogo from "../public/instagram.png";
import { useRecoilState, useSetRecoilState } from "recoil";
import { errorMessage } from "../utils/atoms/errorMessage";
import getErrorMessage from "../utils/firebaseErrors";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SplashScreen from "../components/SplashScreen";

const Login: NextPage = () => {
  const router = useRouter();
  const { user, loading, signInWithGoogle } = useAuth();
  const setLoginError = useSetRecoilState(errorMessage);

  useEffect(() => {
    if (user) {
      router.replace("/");
    }
  }, [user, router]);

  const [toastMessage, setToastMessage] = useRecoilState(errorMessage);
  useEffect(() => {
    if (!toastMessage) return;
    toast.warn(toastMessage, {
      onClose: () => {
        setToastMessage(null);
      },
    });
  }, [toastMessage]);

  if (loading) {
    return <SplashScreen />;
  }

  const login = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      setLoginError(getErrorMessage(error));
    }
  };

  return (
    <main>
      <div className="flex flex-col items-center justify-center gap-16 h-screen">
        <Image
          src={InstagramLogo}
          alt="instagram logo"
          width={150}
          height={150}
          placeholder="blur"
        />
        <button
          className="px-8 py-2 text-lg tracking-wider rounded-md 
          bg-gradient-to-bl from-fuchsia-600 to-yellow-500 text-white"
          onClick={login}
        >
          login
        </button>
      </div>
      <ToastContainer
        position="bottom-left"
        autoClose={5000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </main>
  );
};

export default Login;
