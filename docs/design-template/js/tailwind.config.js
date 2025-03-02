tailwind.config = {
    theme: {
        extend: {
            fontFamily: {
                'sans': ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
            },
            colors: {
                // Color System Documentation
                // --------------------------
                // Numbers increment by 50 for categorical distinction
                // 100-400: Primary category accents (Creative, Business, etc.)
                // 500+: Supplementary colors for UI variations
                // Format: accent-{number} (e.g. bg-accent-150)
                // New colors should follow existing luminance progression
                accent: {
                    100: '#8B5CF6',   // Purple - Creative
                    150: '#3B82F6',   // Blue - Business
                    200: '#EC4899',   // Pink - Visual Arts
                    250: '#10B981',   // Emerald - Educational
                    300: '#F59E0B',   // Amber - Marketing
                    350: '#14B8A6',   // Teal - Technical
                    400: '#EF4444',   // Red - Gaming
                    450: '#6366F1',   // Indigo - Research
                    500: '#FF6B6B',   // Coral
                    550: '#FF9F43',   // Sunset Orange
                    600: '#F368E0',   // Neon Pink
                    650: '#FF9FF3',   // Bubblegum
                    700: '#54A0FF',   // Sky Blue
                    750: '#00D2D3',   // Caribbean Teal
                    800: '#00B894',   // Mint Green
                    850: '#55E6C1',   // Turquoise
                    900: '#BDC581',   // Olive
                    950: '#FDA7DF',   // Pastel Pink
                    1000: '#D980FA',  // Lavender
                    1050: '#5758BB',  // Royal Blue
                    1100: '#12CBC4',  // Aqua Marine
                    1150: '#ED4C67',  // Watermelon
                    1200: '#B53471',  // Berry
                    1250: '#EE5A24',  // Burnt Orange
                    1300: '#C4E538',  // Lime
                    1350: '#A3CB38',  // Apple Green
                    1400: '#009432',  // Forest Green
                    1450: '#006266',  // Deep Teal
                    1500: '#1B1464',  // Navy
                    1550: '#6F1E51',  // Wine
                    1600: '#EAB543',  // Mustard
                    1650: '#2D3436',  // Charcoal
                    1700: '#D6A2E8'   // Lilac
                }
            }
        }
    }
}
