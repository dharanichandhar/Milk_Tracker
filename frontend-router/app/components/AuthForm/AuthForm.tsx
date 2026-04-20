import { useState } from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

interface AuthFormProps {
    mode: "customer" | "vendor";
}

const AuthForm = ({ mode }: AuthFormProps) => {
    const [isLogin, setIsLogin] = useState(true);

    return isLogin ? (
        <LoginForm mode={mode} onSwitchToSignup={() => setIsLogin(false)} />
    ) : (
        <SignupForm mode={mode} onSwitchToLogin={() => setIsLogin(true)} />
    );
};

export default AuthForm;