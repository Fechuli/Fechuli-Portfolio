export interface Book {
    id: string;
    textures: {
        front: string;
        back: string;
        spine: string;
    };
    pagesColor: string;
    width: number;
    height: number;
    thickness: number;
}

export const BOOKS: Book[] = [
    {
        id: "the_computer",
        textures: {
            front: "/images/about-me/library/the_computer/the_computer_lato.webp",
            back: "/images/about-me/library/the_computer/the_computer_retro.webp",
            spine: "/images/about-me/library/the_computer/the_computer_fronte.webp",
        },
        pagesColor: "#f5f5dc",
        width: 0.8,
        height: 1,
        thickness: 1.3,
    },
    {
        id: "g_e_b",
        textures: {
            front: "/images/about-me/library/g_e_b/g_e_b_lato.webp",
            back: "/images/about-me/library/g_e_b/g_e_b_retro.webp",
            spine: "/images/about-me/library/g_e_b/g_e_b_fronte.webp",
        },
        pagesColor: "#f5f5dc",
        width: 0.5,
        height: 0.8,
        thickness: 1.5,
    },
    {
        id: "mathematica",
        textures: {
            front: "/images/about-me/library/mathematica/mathematica_lato.webp",
            back: "/images/about-me/library/mathematica/mathematica_retro.webp",
            spine: "/images/about-me/library/mathematica/mathematica_fronte.webp",
        },
        pagesColor: "#f5f5dc",
        width: 0.5,
        height: 0.7,
        thickness: 0.6,
    },
    {
        id: "munari_d_c_n_c",
        textures: {
            front: "/images/about-me/library/munari_d_c_n_c/munari_d_c_n_c_lato.webp",
            back: "/images/about-me/library/munari_d_c_n_c/munari_d_c_n_c_retro.webp",
            spine: "/images/about-me/library/munari_d_c_n_c/munari_d_c_n_c_fronte.webp",
        },
        pagesColor: "#f5f5dc",
        width: 0.5,
        height: 0.65,
        thickness: 0.8,
    },
    {
        id: "munari_d_c_v",
        textures: {
            front: "/images/about-me/library/munari_d_c_v/munari_d_c_v_lato.webp",
            back: "/images/about-me/library/munari_d_c_v/munari_d_c_v_retro.webp",
            spine: "/images/about-me/library/munari_d_c_v/munari_d_c_v_fronte.webp",
        },
        pagesColor: "#f5f5dc",
        width: 0.5,
        height: 0.65,
        thickness: 0.8,
    }
];
