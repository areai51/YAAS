export class AppService {
    title: string = 'Hello, world!';
    description: string = 'from Angular2 app with Webpack + Typescript + Karma + SASS';

    public getTitle(): string {
        return this.title;
    }
    public getDescription(): string {
        return this.description;
    }
}
