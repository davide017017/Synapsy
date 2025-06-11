"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";

interface Props {
    value: string;
    onChange: (value: string) => void;
}

export default function PasswordInput({ value, onChange }: Props) {
    const [show, setShow] = useState(false);

    return (
        <div className="relative flex flex-col items-center w-full max-w-sm">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
                type={show ? "text" : "password"}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Password"
                required
                className="w-full pl-10 pr-10 py-2 rounded-md bg-white text-black placeholder-gray-500 shadow-sm ring-2 ring-transparent focus:outline-none focus:ring-primary transition"
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
