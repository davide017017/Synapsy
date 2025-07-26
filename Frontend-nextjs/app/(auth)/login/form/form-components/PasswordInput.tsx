"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";

interface Props {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    isValid?: boolean;
}

export default function PasswordInput({ value, onChange, placeholder = "Password", isValid }: Props) {
    const [show, setShow] = useState(false);

    return (
        <div className="relative flex flex-col items-center w-full max-w-sm">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
                type={show ? "text" : "password"}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                required
                className={`w-full pl-10 pr-10 py-2 rounded-md bg-white text-black placeholder-gray-500 shadow-sm ring-2 focus:outline-none transition ${isValid === undefined ? 'ring-transparent' : isValid ? 'ring-green-500' : 'ring-red-500'}`}
            />
            <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary focus:outline-none"
                aria-label={show ? "Nascondi password" : "Mostra password"}
            >
                {show ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
        </div>
    );
}
