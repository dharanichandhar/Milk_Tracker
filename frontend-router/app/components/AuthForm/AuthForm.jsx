import { useState } from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

const AuthForm = ({ mode }) => {
    const [isLogin, setIsLogin] = useState(true);

    return isLogin ? (
        <LoginForm mode={mode} onSwitchToSignup={() => setIsLogin(false)} />
    ) : (
        <SignupForm mode={mode} onSwitchToLogin={() => setIsLogin(true)} />
    );
};

export default AuthForm;
