import { startOfHour } from 'date-fns';

import Appointment from '../models/Appointment';
import AppointmentRepository from '../repositories/AppointmentsRepository';

interface Request {
  provider: string;
  date: Date;
}

/**
 * Dependency Inversion
 */

class CreateAppointmentService {
  private appointmentsRepository: AppointmentRepository;

  constructor(appointmentsRespository: AppointmentRepository) {
    this.appointmentsRepository = appointmentsRespository;
  }

  public execute({ provider, date }: Request): Appointment {
    const appointmentDate = startOfHour(date);

    /* Verificando se existe um appointment marcado */
    const findAppointmentInSameDate = this.appointmentsRepository.findByData(
      appointmentDate,
    );

    if (findAppointmentInSameDate) {
      throw Error('This appointment is already booked');
    }

    const appointment = this.appointmentsRepository.create({
      provider,
      date: appointmentDate,
    });

    return appointment;
  }
}

export default CreateAppointmentService;
