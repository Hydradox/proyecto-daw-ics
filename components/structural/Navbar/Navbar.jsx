import style from "./Navbar.module.scss"
import Link from "next/link"
import Image from "next/image"

export default function Navbar() {
    return (
        <nav className={style.Navbar}>
            <Link className={style.LogoWrapper} href="/"><Image src="/logo.png" alt="ICS logo" fill style={{ objectFit: 'contain' }} /></Link>
            <Link className={style.EndGroup} href="/account">Iniciar sesión</Link>
        </nav>
    )
}