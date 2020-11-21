import IParseMailTemplateDTO from '../dtos/IParseMailTemplateDTO';

export default interface IMailTempleteProvider {
  parse(data: IParseMailTemplateDTO): Promise<string>;
}
