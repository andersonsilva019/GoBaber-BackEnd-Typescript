import { Router } from 'express';
import { parseISO } from 'date-fns';
import AppointmentRepository from '../repositories/AppointmentsRepository';
import CreateAppointmentService from '../services/CreateAppointmentService';

const appointmentsRouter = Router();

const appointmentRepository = new AppointmentRepository();

appointmentsRouter.get('/', (request, response) => {
  const appointment = appointmentRepository.all();

  return response.json(appointment);
});

appointmentsRouter.post('/', (request, response) => {
  try {
    const { provider, date } = request.body;

    // parseDate -> 2020-06-26T17:00:00.000Z
    const parsedDate = parseISO(date);

    const createAppointment = new CreateAppointmentService(
      appointmentRepository,
    );

    const appointment = createAppointment.execute({
      provider,
      date: parsedDate,
    });

    return response.json(appointment);
  } catch (error) {
    return response.status(400).json({ error: error.message });
  }
});

export default appointmentsRouter;
