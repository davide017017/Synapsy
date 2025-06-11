"use client";

interface Props {
    onForgotClick: () => void;
    onRegisterClick: () => void;
}

export default function AuthLinks({ onForgotClick, onRegisterClick }: Props) {
    return (
        <div className="text-sm text-center text-white mt-4 space-y-2">
            <button onClick={onForgotClick} className="text-primary hover:underline transition-colors duration-200">
                🔐 Password dimenticata?
            </button>
            <div>
                Non hai un account?{" "}
                <button
                    onClick={onRegisterClick}
                    className="text-primary hover:underline font-medium transition-colors duration-200"
                >
                    Registrati
                </button>
            </div>
        </div>
    );
}
