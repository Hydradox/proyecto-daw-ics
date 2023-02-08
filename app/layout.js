import './globals.scss'
import Navbar from '@/components/structural/Navbar/Navbar'

export default function RootLayout({ children }) {
	return (
		<html lang="es">
			{/*
				<head /> will contain the components returned by the nearest parent
				head.js. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
			*/}
			<head />
			<body>
				<Navbar />
				<main>
					{children}
				</main>
			</body>
		</html>
	)
}
