import { Router } from 'express';
import { startOfHour, parseISO, isEqual } from 'date-fns';
import Appointment from '../models/Appointment';

const appointmentsRouter = Router();

// O tipo dessa variavel é um array de appointments
const appointments: Appointment[] = [];

appointmentsRouter.post('/', (request, response) => {
  const { provider, date } = request.body;

  // parseDate -> 2020-06-26T17:00:00.000Z
  const parseDate = startOfHour(parseISO(date));

  // Verifica se já existe o horário
  const findAppointmentInSameDate = appointments.find(appointment =>
    isEqual(parseDate, appointment.date),
  );

  if (findAppointmentInSameDate) {
    return response
      .status(400)
      .json({ message: 'This appointment is already booked' });
  }

  const appointment = new Appointment(provider, parseDate);

  appointments.push(appointment);

  return response.json(appointment);
});

export default appointmentsRouter;
