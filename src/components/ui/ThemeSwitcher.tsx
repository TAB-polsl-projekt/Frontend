'use client';

import {FiSun, FiMoon} from 'react-icons/fi';
import {useState, useEffect} from 'react';
import { useTheme } from 'next-themes';

export default function ThemeSwitcher() {
    const [mounted, setMounted] = useState(false);
    const { resolvedTheme, setTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (<button onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}>
        {resolvedTheme === 'dark' ? <FiSun size={24} /> : <FiMoon size={24} />}
    </button>)

}