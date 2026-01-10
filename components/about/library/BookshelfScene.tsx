"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import Book from "./Book";
import { BOOKS, type Book as BookType } from "@/data/books";

interface BookshelfSceneProps {
    onSelectBook: (book: BookType) => void;
    selectedBook: BookType | null;
}

function Shelf({ position, width = 10 }: { position: [number, number, number]; width?: number }) {
    return (
        <group position={position}>
            <mesh position={[0, 0, 0]}>
                <boxGeometry args={[width, 0.01, 0.2]} />
                <meshStandardMaterial color="#4a1a2a" roughness={0.7} metalness={0.1} />
            </mesh>
            <mesh position={[0, -0.02, 0.18]}>
                <boxGeometry args={[width, 0.06, 0.04]} />
                <meshStandardMaterial color="#5a2a3a" roughness={0.7} metalness={0.1} />
            </mesh>
        </group>
    );
}

function Bookshelf({
    onSelectBook,
    selectedBook,
}: {
    onSelectBook: (book: BookType) => void;
    selectedBook: BookType | null;
}) {
    const shelfWidth = 6;
    const shelfY = 0;

    return (
        <group>
            <Shelf position={[0, shelfY - 0.55, 0.3]} width={shelfWidth} />

            {BOOKS.map((book, index) => {
                const gap = 0.02; 

                let x = 0;
                for (let i = 0; i < index; i++) {
                    x += BOOKS[i].thickness * 0.1 + gap;
                }
                x += (book.thickness * 0.1) / 2;

                const totalWidth = BOOKS.reduce((acc, b, i) => {
                    return acc + b.thickness * 0.1 + (i < BOOKS.length - 1 ? gap : 0);
                }, 0);

                x -= totalWidth / 2;

                return (
                    <Book
                        key={book.id}
                        book={book}
                        position={[x, shelfY, 0]}
                        onClick={() => onSelectBook(book)}
                        isSelected={selectedBook?.id === book.id}
                    />
                );
            })}
        </group>
    );
}

function LoadingFallback() {
    return (
        <mesh>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#330014" wireframe />
        </mesh>
    );
}

export default function BookshelfScene({
    onSelectBook,
    selectedBook,
}: BookshelfSceneProps) {
    return (
        <Canvas
            camera={{
                position: [0, 0, 2],
                fov: 45,
                near: 0.1,
                far: 100,
            }}
            dpr={[1, 2]}
            gl={{
                antialias: true,
                powerPreference: "high-performance",
            }}
            style={{ background: "#330014" }}
        >
            <ambientLight intensity={0.8} color="#FFF5F5" />
            <directionalLight
                position={[2, 5, 8]}
                intensity={1.5}
                color="#FFF5F5"
            />
            <directionalLight
                position={[-5, 3, 4]}
                intensity={0.8}
                color="#FFE4D6"
            />
            <directionalLight
                position={[0, -2, 5]}
                intensity={0.5}
                color="#FFF5F5"
            />
            <Suspense fallback={<LoadingFallback />}>
                <Bookshelf onSelectBook={onSelectBook} selectedBook={selectedBook} />
            </Suspense>
        </Canvas>
    );
}
