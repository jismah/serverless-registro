import { Button } from "@tremor/react";
import Link from "next/link";
import Image from 'next/image'

export default function RegistrosPasados() {
    return (
        <main>
            <nav className="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
                <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-3">
                    <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                        <Image
                            src="/logoPUCMM.png"
                            width={40}
                            height={40}
                            alt="PUCMM Logo"
                        />
                        <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Gestor de Reservas</span>
                    </a>
                    <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                        <Link href="/">
                            <Button variant="primary">
                                Ir a Menú
                            </Button>
                        </Link>
                        <button data-collapse-toggle="navbar-sticky" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-sticky" aria-expanded="false">
                            <span className="sr-only">Open main menu</span>
                            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
                            </svg>
                        </button>
                    </div>
                    <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-sticky">

                    </div>
                </div>
            </nav>

            <section className="mt-20 p-3 sm:p-5">
                <div className="mx-auto max-w-screen-xl px-4 lg:px-12">
                    <div className="relative overflow-hidden bg-white shadow-sm border dark:bg-gray-800 sm:rounded-lg mb-5">
                        <div className="flex-row items-center justify-between p-4 space-y-3 sm:flex sm:space-y-0 sm:space-x-4">
                            <div>
                                <h5 className="mr-3 font-semibold dark:text-white">Reservas Pasadas</h5>
                            </div>
                        </div>

                    </div>
                    <div className="bg-white dark:bg-gray-800 relative shadow-sm border sm:rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th scope="col" className="px-4 py-3">ID</th>
                                        <th scope="col" className="px-4 py-3">Nombre</th>
                                        <th scope="col" className="px-4 py-3">Laboratorio</th>
                                        <th scope="col" className="px-4 py-3">Fecha</th>
                                        <th scope="col" className="px-4 py-3">Hora</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b dark:border-gray-700">
                                        <th scope="row" className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">00001</th>
                                        <td className="px-4 py-3">John Rodriguez</td>
                                        <td className="px-4 py-3">Redes</td>
                                        <td className="px-4 py-3">15/3/2024</td>
                                        <td className="px-4 py-3">10:00 a 12:00</td>
                                    </tr>
                                    <tr className="border-b dark:border-gray-700">
                                        <th scope="row" className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">00002</th>
                                        <td className="px-4 py-3">Jose Reyes</td>
                                        <td className="px-4 py-3">Computacion</td>
                                        <td className="px-4 py-3">15/3/2024</td>
                                        <td className="px-4 py-3">15:00 a 17:00</td>
                                    </tr>

                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}