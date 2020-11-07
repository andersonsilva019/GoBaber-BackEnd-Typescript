import FakerAppointmentsRepository from '../repositories/fakes/FakerAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

describe('CreateAppointment', () => {
  it('should be able to create a new appointment', async () => {
    const fakerAppointmentsRepository = new FakerAppointmentsRepository();
    const createAppointment = new CreateAppointmentService(
      fakerAppointmentsRepository,
    );

    const appointment = await createAppointment.execute({
      date: new Date(),
      provider_id: '12354848484',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('12354848484');
  });

  // it('should not be able to create two appointments on the same time', () => {
  //   expect(1 + 2).toBe(3);
  // });
});
