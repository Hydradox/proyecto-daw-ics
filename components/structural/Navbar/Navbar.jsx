import style from "./Navbar.module.scss"
import Link from "next/link"
import Image from "next/image"

export default function Navbar() {
    return (
        <nav className={style.Navbar}>
            <Link className={style.LogoWrapper} href="/"><Image className={style.Logo} src="/logo.png" alt="ICS logo" fill /></Link>
            <Link href="/account">Account</Link>
        </nav>
    )
}