"use client";

export default function ChromaticFilter() {

    return (
        <>
            <svg
                style={{
                    position: 'absolute',
                    width: 0,
                    height: 0,
                    pointerEvents: 'none'
                }}
            >
                <defs>
                    <filter id="chromatic-aberration" x="-50%" y="-50%" width="200%" height="200%">
                        <feOffset in="SourceGraphic" dx="-4" dy="-1" result="redOffset" />
                        <feComponentTransfer in="redOffset" result="redChannel">
                            <feFuncR type="identity" />
                            <feFuncG type="discrete" tableValues="0" />
                            <feFuncB type="discrete" tableValues="0" />
                        </feComponentTransfer>

                        <feOffset in="SourceGraphic" dx="0" dy="1" result="greenOffset" />
                        <feComponentTransfer in="greenOffset" result="greenChannel">
                            <feFuncR type="discrete" tableValues="0" />
                            <feFuncG type="identity" />
                            <feFuncB type="discrete" tableValues="0" />
                        </feComponentTransfer>

                        <feOffset in="SourceGraphic" dx="4" dy="1" result="blueOffset" />
                        <feComponentTransfer in="blueOffset" result="blueChannel">
                            <feFuncR type="discrete" tableValues="0" />
                            <feFuncG type="discrete" tableValues="0" />
                            <feFuncB type="identity" />
                        </feComponentTransfer>

                        <feComposite in="redChannel" in2="greenChannel" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="rg" />
                        <feComposite in="rg" in2="blueChannel" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="rgb" />
                    </filter>
                </defs>
            </svg>

            <div
                className="fixed inset-0 pointer-events-none"
                style={{
                    zIndex: 99995,
                    filter: 'url(#chromatic-aberration)',
                    backdropFilter: 'url(#chromatic-aberration)'
                }}
            />
        </>
    );
}
