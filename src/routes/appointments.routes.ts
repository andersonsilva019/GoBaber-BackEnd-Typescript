import { Router } from 'express';
import { startOfHour, parseISO } from 'date-fns';
import AppointmentRepository from '../repositories/AppointmentsRepository';

const appointmentsRouter = Router();

const appointmentRepository = new AppointmentRepository();

appointmentsRouter.get('/', (request, response) => {
  const appointment = appointmentRepository.all();

  return response.json(appointment);
});

appointmentsRouter.post('/', (request, response) => {
  const { provider, date } = request.body;

  // parseDate -> 2020-06-26T17:00:00.000Z
  const parseDate = startOfHour(parseISO(date));

  /* Verificando se existe um appointment marcado */
  const findAppointmentInSameDate = appointmentRepository.findByData(parseDate);

  if (findAppointmentInSameDate) {
    return response
      .status(400)
      .json({ message: 'This appointment is already booked' });
  }

  const appointment = appointmentRepository.create(provider, parseDate);

  return response.json(appointment);
});

export default appointmentsRouter;
