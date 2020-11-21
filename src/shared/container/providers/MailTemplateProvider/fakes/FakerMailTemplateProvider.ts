import IMailTempleteProvider from '../models/IMailTemplateProvider';

class FakerMailTemplateProvider implements IMailTempleteProvider {
  public async parse(): Promise<string> {
    return 'Mail content';
  }
}

export default FakerMailTemplateProvider;
