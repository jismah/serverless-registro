import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react";
import { Button, DatePicker, Select, SelectItem, TextInput } from "@tremor/react";
import es from 'date-fns/locale/es';
import Link from "next/link";
import Image from 'next/image'
import { RiAddLine } from "@remixicon/react";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { format, parseISO } from "date-fns";

interface Reserva {
  id: string;
  matricula: string;
  nombre: string;
  correo: string;
  laboratorio: string;
  fecha: string;
  hora: string;
}

export default function Home() {

  const { isOpen, onOpen, onClose } = useDisclosure();
  const dateNow = new Date();

  const fetcher = async (url: string) => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Hubo un problema al obtener las reservas.');
    }
    const data = await response.json();
    return data.reservas;
  }

  const { data: reservas, error: errorReservas, mutate: mutateReservas } = useSWR('https://rq91yb8eui.execute-api.us-east-1.amazonaws.com/default/reservas-funcion', fetcher);
  
  const [datosReserva, setDatosReserva] = useState<Reserva>({
    id: '',
    matricula: '',
    nombre: '',
    correo: '',
    laboratorio: '',
    fecha: '',
    hora: '',
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(datosReserva);
    try {
      await guardarDatos(datosReserva);
      mutateReservas();

      // Limpiar Inputs
      setDatosReserva({
        id: '',
        matricula: '',
        nombre: '',
        correo: '',
        laboratorio: '',
        fecha: '',
        hora: '',
      });

    } catch (error) {
      console.error('Error al guardar la reserva:', error);
    }
  };

  async function guardarDatos(datosReserva: Reserva) {
    try {
      await fetch('https://rq91yb8eui.execute-api.us-east-1.amazonaws.com/default/reservas-funcion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(datosReserva)
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Hubo un problema al guardar los datos en AWS.');
          }
          alert('Se Guardo Correctamente La Nueva Reserva!');
          return response.json();
        }).finally(() => {

        });
    } catch (error) {
      console.error(error);
    }
  }

  async function deleteReserva(reserva: Reserva) {
    try {
      await fetch(`https://rq91yb8eui.execute-api.us-east-1.amazonaws.com/default/reservas-funcion`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(reserva),
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Hubo un problema al eliminar los datos en AWS.');
          }
          alert('Se Eliminó Correctamente La Reserva!');
          mutateReservas();
          return response.json();
        })
    } catch (error) {
      console.error(error);
    }
  }

  const reservasFuturas = reservas && reservas.filter((reserva: { fecha: string | Date; }) => new Date(reserva.fecha) >= dateNow);

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
            <Link href="/registros-pasados">
              <Button variant="primary">
                Registros Pasados
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
                <h5 className="mr-3 font-semibold dark:text-white">Reservas de Laboratorios</h5>
                <p className="text-gray-500 dark:text-gray-400">Gestion de reservas para los laboratorios de PUCMM</p>
              </div>
              <Button icon={RiAddLine} onClick={onOpen} variant="primary">
                Nueva Reserva
              </Button>


              <Modal isOpen={isOpen} onClose={onClose} size={'xl'} isCentered>
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>Nueva Reserva</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                    <form onSubmit={handleSubmit} method="post" className="mt-2">
                      <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-6">

                        {/* Input Matricula */}
                        <div className="col-span-full">
                          <label
                            htmlFor="matricula"
                            className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
                          >
                            Matricula
                            <span className="text-red-500"> *</span>
                          </label>
                          <TextInput
                            type="text"
                            id="matricula"
                            name="matricula"
                            autoComplete="matricula"
                            placeholder="Matricula"
                            className="mt-2"
                            value={datosReserva.matricula || ""}
                            onChange={(e) => setDatosReserva({ ...datosReserva, matricula: e.target.value })}
                            required
                          />
                        </div>

                        {/* Input Nombre */}
                        <div className="col-span-full sm:col-span-3">
                          <label
                            htmlFor="name"
                            className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
                          >
                            Nombre Completo
                            <span className="text-red-500"> *</span>
                          </label>
                          <TextInput
                            type="text"
                            id="name"
                            name="name"
                            autoComplete="name"
                            placeholder="Nombre Estudiante"
                            className="mt-2"
                            value={datosReserva.nombre || ""}
                            onChange={(e) => setDatosReserva({ ...datosReserva, nombre: e.target.value })}
                            required
                          />
                        </div>

                        {/* Input Correo*/}
                        <div className="col-span-full sm:col-span-3">
                          <label
                            htmlFor="email"
                            className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
                          >
                            Correo
                            <span className="text-red-500"> *</span>
                          </label>
                          <TextInput
                            type="text"
                            id="email"
                            name="email"
                            autoComplete="email"
                            placeholder="Email"
                            className="mt-2"
                            value={datosReserva.correo || ""}
                            onChange={(e) => setDatosReserva({ ...datosReserva, correo: e.target.value })}
                            required
                          />
                        </div>

                        {/* Select a Laboratorios */}
                        <div className="col-span-full">
                          <label htmlFor="laboratorios" className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">Laboratorios</label>
                          <Select id="laboratorios" name="laboratorios" className="mt-2" placeholder="Laboratorios" value={datosReserva.laboratorio || ""} onValueChange={(e) => setDatosReserva({ ...datosReserva, laboratorio: e })}>
                            <SelectItem value="Redes">
                              Redes
                            </SelectItem>
                            <SelectItem value="Computacion">
                              Computacion
                            </SelectItem>
                            <SelectItem value="Comunicaciones">
                              Comunicaciones
                            </SelectItem>
                            <SelectItem value="Medicina">
                              Medicina
                            </SelectItem>
                            <SelectItem value="Nanociencias">
                              Nanociencias
                            </SelectItem>
                          </Select>
                        </div>

                        {/* Input Fecha */}
                        <div className="col-span-full">
                          <label
                            htmlFor="fecha"
                            className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
                          >
                            Fecha
                          </label>
                          <DatePicker onValueChange={(e) => setDatosReserva({ ...datosReserva, fecha: e?.toISOString() || '' })} locale={es} minDate={dateNow} placeholder="Fecha de Reserva" id="fecha" className="mt-2" />
                        </div>

                        {/* Input Horarios */}
                        <div className="col-span-full">
                          <label htmlFor="horarios" className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">Horarios</label>
                          <Select id="horarios" name="horarios" className="mt-2" placeholder="Horarios" value={datosReserva.hora || ""} onValueChange={(e) => setDatosReserva({ ...datosReserva, hora: e })}>
                            <SelectItem value="8-9">
                              8:00 - 9:00
                            </SelectItem>
                            <SelectItem value="9-10">
                              9:00 - 10:00
                            </SelectItem>
                            <SelectItem value="10-11">
                              10:00 - 11:00
                            </SelectItem>
                            <SelectItem value="11-12">
                              11:00 - 12:00
                            </SelectItem>
                            <SelectItem value="12-13">
                              12:00 - 13:00
                            </SelectItem>
                            <SelectItem value="13-14">
                              13:00 - 14:00
                            </SelectItem>
                            <SelectItem value="14-15">
                              14:00 - 15:00
                            </SelectItem>
                            <SelectItem value="15-16">
                              15:00 - 16:00
                            </SelectItem>
                            <SelectItem value="16-17">
                              16:00 - 17:00
                            </SelectItem>
                            <SelectItem value="17-18">
                              17:00 - 18:00
                            </SelectItem>
                            <SelectItem value="18-19">
                              18:00 - 19:00
                            </SelectItem>
                            <SelectItem value="19-20">
                              19:00 - 20:00
                            </SelectItem>
                            <SelectItem value="20-21">
                              20:00 - 21:00
                            </SelectItem>
                            <SelectItem value="21-22">
                              21:00 - 22:00
                            </SelectItem>
                          </Select>
                        </div>
                      </div>

                      {/* Footer de Modal */}
                      <div className="my-6 flex items-center justify-end space-x-4">
                        <button
                          type="button"
                          className="whitespace-nowrap rounded-tremor-small px-4 py-2.5 text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
                          onClick={onClose}
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          className="whitespace-nowrap rounded-tremor-default bg-tremor-brand px-4 py-2.5 text-tremor-default font-medium text-tremor-brand-inverted shadow-tremor-input hover:bg-tremor-brand-emphasis dark:bg-dark-tremor-brand dark:text-dark-tremor-brand-inverted dark:shadow-dark-tremor-input dark:hover:bg-dark-tremor-brand-emphasis"
                        >
                          Crear Reserva
                        </button>
                      </div>
                    </form>
                  </ModalBody>


                </ModalContent>
              </Modal>
            </div>
          </div>


          <div className="bg-white dark:bg-gray-800 relative shadow-sm border sm:rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-4 py-3">ID</th>
                    <th scope="col" className="px-4 py-3">Matricula</th>
                    <th scope="col" className="px-4 py-3">Nombre</th>
                    <th scope="col" className="px-4 py-3">Laboratorio</th>
                    <th scope="col" className="px-4 py-3">Fecha</th>
                    <th scope="col" className="px-4 py-3">Hora</th>
                    <th scope="col" className="px-4 py-3">Acciones</th>
                  </tr>
                </thead>
                <tbody>

                  {Array.isArray(reservasFuturas) && reservasFuturas.map((reserva: Reserva) => (
                    <tr key={reserva.id} className="border-b dark:border-gray-700">
                      <th scope="row" className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">{reserva.id}</th>
                      <td className="px-4 py-3">{reserva.matricula}</td>
                      <td className="px-4 py-3">{reserva.nombre}</td>
                      <td className="px-4 py-3">{reserva.laboratorio}</td>
                      <td className="px-4 py-3">{format(parseISO(reserva.fecha), 'dd/MM/yyyy')}</td>
                      <td className="px-4 py-3">{reserva.hora}</td>
                      <td className="px-4 py-3">
                        <Button className="me-4" variant="light">Editar</Button>
                        <Button onClick={() => deleteReserva(reserva)} className="ms-4" variant="light" color="red">Eliminar</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>


    </main>
  );
}
